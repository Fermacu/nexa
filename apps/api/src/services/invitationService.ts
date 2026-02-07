/**
 * Invitation Service
 *
 * Company invitations: invitee must accept before becoming a member.
 */

import * as firebase from '../config/firebase';
import { NotFoundError, ForbiddenError, AppError } from '../utils/errors';
import { getUserByUid } from './userService';
import { createNotification, markAsRead } from './notificationService';
import type { Company } from './companyService';
import { getCompanyById } from './companyService';

export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface Invitation {
  id: string;
  companyId: string;
  userId: string;
  invitedBy: string;
  role: string;
  status: InvitationStatus;
  createdAt: string;
}

export interface InvitationWithDetails extends Invitation {
  companyName: string;
  inviterName: string;
}

/**
 * Create a pending invitation (and a notification for the invitee)
 */
export async function createInvitation(
  companyId: string,
  invitedByUid: string,
  userId: string,
  role: string,
  companyName: string,
  inviterName: string
): Promise<Invitation> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const FieldValue = firebase.default.firestore.FieldValue;
  const now = FieldValue.serverTimestamp();

  const invRef = await firebase.db.collection('invitations').add({
    companyId,
    userId,
    invitedBy: invitedByUid,
    role,
    status: 'pending',
    createdAt: now,
  });

  await createNotification(userId, 'company_invitation', {
    invitationId: invRef.id,
    companyId,
    companyName,
    role,
    inviterName,
  });

  return {
    id: invRef.id,
    companyId,
    userId,
    invitedBy: invitedByUid,
    role,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Get invitation by ID (must be the invitee to access)
 */
export async function getInvitationById(
  invitationId: string,
  uid: string
): Promise<InvitationWithDetails | null> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const invDoc = await firebase.db.collection('invitations').doc(invitationId).get();
  if (!invDoc.exists) return null;

  const data = invDoc.data();
  if (data?.userId !== uid) return null;

  const inviter = await getUserByUid(data.invitedBy).catch(() => null);
  const company = await getCompanyById(data.companyId).catch(() => null);

  return {
    id: invDoc.id,
    companyId: data!.companyId,
    userId: data!.userId,
    invitedBy: data!.invitedBy,
    role: data!.role,
    status: data!.status,
    createdAt: data!.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    companyName: (company as Company)?.name ?? '',
    inviterName: inviter?.name ?? '',
  };
}

/**
 * Accept invitation: create membership, update invitation, mark notification read
 */
export async function acceptInvitation(invitationId: string, uid: string): Promise<void> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const invRef = firebase.db.collection('invitations').doc(invitationId);
  const invDoc = await invRef.get();

  if (!invDoc.exists) {
    throw new NotFoundError('Invitación');
  }

  const data = invDoc.data()!;
  if (data.userId !== uid) {
    throw new ForbiddenError('No puedes aceptar esta invitación');
  }
  if (data.status !== 'pending') {
    throw new AppError('Esta invitación ya fue respondida', 400, 'INVITATION_ALREADY_RESPONDED');
  }

  const FieldValue = firebase.default.firestore.FieldValue;
  const now = FieldValue.serverTimestamp();

  await firebase.db.collection('memberships').add({
    userId: data.userId,
    companyId: data.companyId,
    role: data.role,
    joinedAt: now,
  });

  await invRef.update({ status: 'accepted', respondedAt: now });

  const notifSnapshot = await firebase.db
    .collection('notifications')
    .where('userId', '==', uid)
    .where('invitationId', '==', invitationId)
    .limit(1)
    .get();

  if (!notifSnapshot.empty) {
    await markAsRead(notifSnapshot.docs[0].id, uid);
  }
}

/**
 * Decline invitation: update invitation, mark notification read
 */
export async function declineInvitation(invitationId: string, uid: string): Promise<void> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const invRef = firebase.db.collection('invitations').doc(invitationId);
  const invDoc = await invRef.get();

  if (!invDoc.exists) {
    throw new NotFoundError('Invitación');
  }

  const data = invDoc.data()!;
  if (data.userId !== uid) {
    throw new ForbiddenError('No puedes rechazar esta invitación');
  }
  if (data.status !== 'pending') {
    throw new AppError('Esta invitación ya fue respondida', 400, 'INVITATION_ALREADY_RESPONDED');
  }

  const FieldValue = firebase.default.firestore.FieldValue;
  await invRef.update({ status: 'declined', respondedAt: FieldValue.serverTimestamp() });

  const notifSnapshot = await firebase.db
    .collection('notifications')
    .where('userId', '==', uid)
    .where('invitationId', '==', invitationId)
    .limit(1)
    .get();

  if (!notifSnapshot.empty) {
    await markAsRead(notifSnapshot.docs[0].id, uid);
  }
}
