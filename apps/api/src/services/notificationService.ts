/**
 * Notification Service
 *
 * Manages user notifications (invitations, and future types).
 * Notifications are stored per user with read/unread state.
 */

import * as firebase from '../config/firebase';
import { AppError, NotFoundError } from '../utils/errors';

export type NotificationType = 'company_invitation';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data: Record<string, unknown>;
}

export interface CompanyInvitationData {
  invitationId: string;
  companyId: string;
  companyName: string;
  role: string;
  inviterName: string;
}

/**
 * Create a notification for a user.
 * For company_invitation, pass invitationId in data (and we store it top-level for querying).
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  data: Record<string, unknown>
): Promise<Notification> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const FieldValue = firebase.default.firestore.FieldValue;
  const now = FieldValue.serverTimestamp();

  const doc: Record<string, unknown> = {
    userId,
    type,
    read: false,
    createdAt: now,
    data,
  };
  if (type === 'company_invitation' && data.invitationId) {
    doc.invitationId = data.invitationId;
  }

  const ref = await firebase.db.collection('notifications').add(doc);

  return {
    id: ref.id,
    userId,
    type,
    read: false,
    createdAt: new Date().toISOString(),
    data,
  };
}

/**
 * Get all notifications for a user (newest first)
 */
export async function getNotificationsByUserId(uid: string): Promise<Notification[]> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const snapshot = await firebase.db
    .collection('notifications')
    .where('userId', '==', uid)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      userId: d.userId,
      type: d.type as NotificationType,
      read: d.read === true,
      createdAt: d.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      data: (d.data as Record<string, unknown>) ?? {},
    };
  });
}

/**
 * Get unread notifications count for a user
 */
export async function getUnreadCount(uid: string): Promise<number> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const snapshot = await firebase.db
    .collection('notifications')
    .where('userId', '==', uid)
    .where('read', '==', false)
    .get();

  return snapshot.size;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string, uid: string): Promise<void> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const ref = firebase.db.collection('notifications').doc(notificationId);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new NotFoundError('Notification');
  }

  const data = doc.data();
  if (data?.userId !== uid) {
    throw new NotFoundError('Notification');
  }

  await ref.update({ read: true });
}
