import * as firebase from '../config/firebase';
import { NotFoundError, ForbiddenError, AppError } from '../utils/errors';
import { getUserByUid, getUserByEmail } from './userService';
import { createInvitation } from './invitationService';

export interface CompanyMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  website?: string;
  description?: string;
  industry?: string;
  createdAt: string;
}

export interface CreateCompanyInput {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  website?: string;
  description?: string;
  industry?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  website?: string;
  description?: string;
  industry?: string;
}

/**
 * Create a new company and add the creator as owner
 */
export async function createCompany(data: CreateCompanyInput, uid: string): Promise<Company> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const FieldValue = firebase.default.firestore.FieldValue;
  const now = FieldValue.serverTimestamp();

  // 1. Create Firestore company document
  const companyRef = firebase.db.collection('companies').doc();
  await companyRef.set({
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    ...(data.website && { website: data.website }),
    ...(data.description && { description: data.description }),
    ...(data.industry && { industry: data.industry }),
    createdAt: now,
  });

  const companyId = companyRef.id;

  // 2. Create membership (user is owner of the new company)
  await firebase.db.collection('memberships').add({
    userId: uid,
    companyId,
    role: 'owner',
    joinedAt: now,
  });

  // 3. Return the created company
  return getCompanyById(companyId);
}

/**
 * Get company by ID
 */
export async function getCompanyById(companyId: string): Promise<Company> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const companyDoc = await firebase.db.collection('companies').doc(companyId).get();

  if (!companyDoc.exists) {
    throw new NotFoundError('Company');
  }

  const companyData = companyDoc.data();
  return {
    id: companyDoc.id,
    name: companyData?.name || '',
    email: companyData?.email || '',
    phone: companyData?.phone || '',
    address: companyData?.address || {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    website: companyData?.website,
    description: companyData?.description,
    industry: companyData?.industry,
    createdAt: companyData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
}

const ALLOWED_ROLES = ['owner', 'admin', 'member', 'viewer'] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

/**
 * Get requester's role in the company (or null if not a member)
 */
async function getRequesterRole(uid: string, companyId: string): Promise<AllowedRole | null> {
  if (!firebase.db) return null;

  const snapshot = await firebase.db
    .collection('memberships')
    .where('userId', '==', uid)
    .where('companyId', '==', companyId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const role = snapshot.docs[0].data().role as string;
  return ALLOWED_ROLES.includes(role as AllowedRole) ? (role as AllowedRole) : null;
}

/**
 * Check if user has permission to update company (owner or admin)
 */
async function checkCompanyPermission(uid: string, companyId: string): Promise<boolean> {
  const role = await getRequesterRole(uid, companyId);
  return role === 'owner' || role === 'admin';
}

/**
 * Update company information
 */
export async function updateCompany(
  companyId: string,
  data: UpdateCompanyInput,
  uid: string
): Promise<Company> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  // Check if company exists
  const companyRef = firebase.db.collection('companies').doc(companyId);
  const companyDoc = await companyRef.get();

  if (!companyDoc.exists) {
    throw new NotFoundError('Company');
  }

  // Check if user has admin permission
  const hasPermission = await checkCompanyPermission(uid, companyId);
  if (!hasPermission) {
    throw new ForbiddenError('You do not have permission to update this company');
  }

  // Prepare update data
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.address !== undefined) {
    const currentAddress = companyDoc.data()?.address || {};
    updateData.address = {
      street: data.address.street !== undefined ? data.address.street : currentAddress.street,
      city: data.address.city !== undefined ? data.address.city : currentAddress.city,
      state: data.address.state !== undefined ? data.address.state : currentAddress.state,
      postalCode:
        data.address.postalCode !== undefined ? data.address.postalCode : currentAddress.postalCode,
      country: data.address.country !== undefined ? data.address.country : currentAddress.country,
    };
  }
  if (data.website !== undefined) updateData.website = data.website || null;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.industry !== undefined) updateData.industry = data.industry || null;

  await companyRef.update(updateData);

  // Return updated company
  return getCompanyById(companyId);
}

/**
 * Get list of members for a company (only owner or admin can call this)
 */
export async function getCompanyMembers(companyId: string, uid: string): Promise<CompanyMember[]> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const companyDoc = await firebase.db.collection('companies').doc(companyId).get();
  if (!companyDoc.exists) {
    throw new NotFoundError('Company');
  }

  const hasPermission = await checkCompanyPermission(uid, companyId);
  if (!hasPermission) {
    throw new ForbiddenError('No tienes permiso para ver los miembros de esta organización');
  }

  const membershipsSnapshot = await firebase.db
    .collection('memberships')
    .where('companyId', '==', companyId)
    .get();

  const members: CompanyMember[] = [];

  for (const membershipDoc of membershipsSnapshot.docs) {
    const membershipData = membershipDoc.data();
    const userId = membershipData.userId;
    const role = membershipData.role || 'member';
    const joinedAt =
      membershipData.joinedAt?.toDate?.()?.toISOString() || new Date().toISOString();

    try {
      const user = await getUserByUid(userId);
      members.push({
        userId,
        name: user.name,
        email: user.email,
        role,
        joinedAt,
      });
    } catch {
      // User might have been deleted; include with minimal info
      members.push({
        userId,
        name: '(Usuario no encontrado)',
        email: '',
        role,
        joinedAt,
      });
    }
  }

  return members;
}

export interface AddCompanyMemberInput {
  email: string;
  role: AllowedRole;
}

/**
 * Add a new member to a company (owner or admin only).
 * Admin cannot assign owner role; owner can assign any role.
 */
export async function addCompanyMember(
  companyId: string,
  uid: string,
  input: AddCompanyMemberInput
): Promise<CompanyMember> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const companyDoc = await firebase.db.collection('companies').doc(companyId).get();
  if (!companyDoc.exists) {
    throw new NotFoundError('Company');
  }

  const requesterRole = await getRequesterRole(uid, companyId);
  if (requesterRole !== 'owner' && requesterRole !== 'admin') {
    throw new ForbiddenError('No tienes permiso para agregar miembros a esta organización');
  }

  if (requesterRole === 'admin' && input.role === 'owner') {
    throw new ForbiddenError('Solo un propietario puede asignar el rol de propietario');
  }

  if (!ALLOWED_ROLES.includes(input.role)) {
    throw new AppError('Rol no válido', 400, 'INVALID_ROLE');
  }

  const userToAdd = await getUserByEmail(input.email.trim());
  if (!userToAdd) {
    throw new AppError(
      'No hay ningún usuario registrado en NEXA con ese correo. La persona que deseas agregar debe crear una cuenta en NEXA primero.',
      404,
      'USER_NOT_REGISTERED'
    );
  }

  const alreadyMember = await firebase.db
    .collection('memberships')
    .where('userId', '==', userToAdd.id)
    .where('companyId', '==', companyId)
    .limit(1)
    .get();

  if (!alreadyMember.empty) {
    throw new AppError('Este usuario ya es miembro de la organización', 409, 'ALREADY_MEMBER');
  }

  const pendingInvitation = await firebase.db
    .collection('invitations')
    .where('userId', '==', userToAdd.id)
    .where('companyId', '==', companyId)
    .where('status', '==', 'pending')
    .limit(1)
    .get();

  if (!pendingInvitation.empty) {
    throw new AppError('Ya existe una invitación pendiente para este usuario', 409, 'PENDING_INVITATION');
  }

  const companyData = companyDoc.data();
  const companyName = companyData?.name ?? '';
  const inviter = await getUserByUid(uid).catch(() => null);
  const inviterName = inviter?.name ?? 'Un administrador';

  const invitation = await createInvitation(
    companyId,
    uid,
    userToAdd.id,
    input.role,
    companyName,
    inviterName
  );

  return {
    userId: userToAdd.id,
    name: userToAdd.name,
    email: userToAdd.email,
    role: input.role,
    joinedAt: '', // Not joined yet; invitation sent
    _invitationId: invitation.id,
  } as CompanyMember & { _invitationId: string };
}
