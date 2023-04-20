import { Router } from 'express';
import { readUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { checkAuth } from '../middlewares/checkAuth.middleware.js';
export const userRoute = Router();
userRoute.get('/user', readUser);
userRoute.put('/user', checkAuth, updateUser);
userRoute.delete('/user', checkAuth, deleteUser);
//# sourceMappingURL=user.route.js.map