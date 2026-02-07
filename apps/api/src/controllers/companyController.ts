import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  getCompanyById,
  updateCompany,
  createCompany,
  getCompanyMembers,
  addCompanyMember,
} from '../services/companyService';
import { sendSuccess } from '../utils/response';

/**
 * POST /api/companies
 * Create a new company
 */
export async function createCompanyController(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const company = await createCompany(req.body, req.user.uid);
  return sendSuccess(res, company, 'Organización creada correctamente', 201);
}

/**
 * GET /api/companies/:id
 * Get company by ID
 */
export async function getCompany(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const id = String(req.params.id);
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

  const id = String(req.params.id);
  const company = await updateCompany(id, req.body, req.user.uid);
  return sendSuccess(res, company, 'Información de la empresa actualizada correctamente');
}

/**
 * GET /api/companies/:id/members
 * Get list of members for a company (owner or admin only)
 */
export async function getCompanyMembersController(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const id = String(req.params.id);
  const members = await getCompanyMembers(id, req.user.uid);
  return sendSuccess(res, members);
}

/**
 * POST /api/companies/:id/members
 * Add a new member to the company (owner or admin only)
 */
export async function addCompanyMemberController(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const id = String(req.params.id);
  const { email, role } = req.body as { email: string; role: string };
  await addCompanyMember(id, req.user.uid, { email, role: role as any });
  return sendSuccess(
    res,
    { invitationSent: true },
    'Invitación enviada. La persona recibirá una notificación y deberá aceptar para unirse a la organización.',
    201
  );
}
