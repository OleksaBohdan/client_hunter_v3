import { Router } from 'express';
import { readCompanies } from '../controllers/company.controller.js';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';

export const companyRoute = Router();

companyRoute.get('/companies', checkAuth, readCompanies);
