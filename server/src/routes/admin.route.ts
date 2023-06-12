import { Router } from 'express';
import { transferCompaniesDB } from '../controllers/admin.controller.js';

export const adminRoute = Router();

adminRoute.get('/admin/transfer', transferCompaniesDB);
