import { Router } from 'express';
import { createCity, readCities, deleteCityById, chooseCity } from '../controllers/city.controller.js';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';
export const cityRoute = Router();
cityRoute.post('/city', checkAuth, createCity);
cityRoute.get('/cities', checkAuth, readCities);
cityRoute.put('/city', checkAuth, chooseCity);
cityRoute.delete('/city/:id', checkAuth, deleteCityById);
//# sourceMappingURL=city.route.js.map