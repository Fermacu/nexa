import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getCompanyById, updateCompany } from '../services/companyService';
import { sendSuccess } from '../utils/response';

/**
 * GET /api/companies/:id
 * Get company by ID
 */
export async function getCompany(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { id } = req.params;
  const company = await getCompanyById(id);
  return sendSuccess(res, company);
}

/**
 * PUT /api/companies/:id
 * Update company information
 */
export async function updateCompanyController(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const { id } = req.params;
  const company = await updateCompany(id, req.body, req.user.uid);
  return sendSuccess(res, company, 'Información de la empresa actualizada correctamente');
}
