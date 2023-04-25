import { Router } from 'express';
import { readCompanies, downloadCompany, deleteCompaniesByName } from '../controllers/company.controller.js';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';

export const companyRoute = Router();

companyRoute.get('/companies', checkAuth, readCompanies);
companyRoute.get('/companies/:status', checkAuth, downloadCompany);
companyRoute.delete('/companies', checkAuth, deleteCompaniesByName);
