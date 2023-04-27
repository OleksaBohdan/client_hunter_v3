import { Router } from 'express';
import { changeCompaniesStatus } from '../controllers/status.controller.js';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';
export const statusRoute = Router();
statusRoute.post('/status', checkAuth, changeCompaniesStatus);
//# sourceMappingURL=status.route.js.map