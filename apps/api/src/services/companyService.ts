import * as firebase from '../config/firebase';
import { NotFoundError, ForbiddenError, AppError } from '../utils/errors';

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

/**
 * Check if user has permission to update company
 */
async function checkCompanyPermission(uid: string, companyId: string): Promise<boolean> {
  if (!firebase.db) {
    return false;
  }

  const membershipSnapshot = await firebase.db
    .collection('memberships')
    .where('userId', '==', uid)
    .where('companyId', '==', companyId)
    .limit(1)
    .get();

  if (membershipSnapshot.empty) {
    return false;
  }

  const membership = membershipSnapshot.docs[0].data();
  return membership.role === 'admin';
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
