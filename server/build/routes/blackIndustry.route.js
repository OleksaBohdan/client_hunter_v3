import { Router } from 'express';
import { createBlackIndustry, readBlackIndustries, deleteBlackIndustryById, } from '../controllers/blackIndustry.controller.js';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';
export const blackIndustryRoute = Router();
blackIndustryRoute.post('/blackindustry', checkAuth, createBlackIndustry);
blackIndustryRoute.get('/blackindustries', checkAuth, readBlackIndustries);
blackIndustryRoute.delete('/blackindustry/:id', checkAuth, deleteBlackIndustryById);
//# sourceMappingURL=blackIndustry.route.js.map