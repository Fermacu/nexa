import * as firebase from '../config/firebase';
import { NotFoundError, AppError } from '../utils/errors';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * Get user by UID
 */
export async function getUserByUid(uid: string): Promise<User> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const userDoc = await firebase.db.collection('users').doc(uid).get();

  if (!userDoc.exists) {
    throw new NotFoundError('User');
  }

  const userData = userDoc.data();
  return {
    id: userDoc.id,
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone,
    createdAt: userData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
}

/**
 * Update user information
 */
export async function updateUser(uid: string, data: UpdateUserInput): Promise<User> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  const userRef = firebase.db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new NotFoundError('User');
  }

  // Prepare update data
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone || null;

  await userRef.update(updateData);

  // Return updated user
  return getUserByUid(uid);
}

/**
 * Get user's companies (memberships)
 */
export interface CompanyMembership {
  companyId: string;
  companyName: string;
  role: string;
  joinedAt: string;
  company: {
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
  };
}

export async function getUserCompanies(uid: string): Promise<CompanyMembership[]> {
  if (!firebase.db) {
    throw new AppError('Firebase database not configured', 503);
  }

  // Get all memberships for this user
  const membershipsSnapshot = await firebase.db
    .collection('memberships')
    .where('userId', '==', uid)
    .get();

  if (membershipsSnapshot.empty) {
    return [];
  }

  // Get company details for each membership
  const companies: CompanyMembership[] = [];

  for (const membershipDoc of membershipsSnapshot.docs) {
    const membershipData = membershipDoc.data();
    const companyId = membershipData.companyId;

    // Get company document
    const companyDoc = await firebase.db.collection('companies').doc(companyId).get();

    if (companyDoc.exists) {
      const companyData = companyDoc.data();
      companies.push({
        companyId,
        companyName: companyData?.name || '',
        role: membershipData.role || 'member',
        joinedAt: membershipData.joinedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        company: {
          id: companyId,
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
        },
      });
    }
  }

  return companies;
}
