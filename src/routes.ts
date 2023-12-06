import { Router } from 'express';

import AuthController from './controllers/AuthController';
import CategoryController from './controllers/CategoryController';
import ProductController from './controllers/ProductController';
import { authMiddleware } from './middleware/AuthMiddleware';

const routes = Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

routes.get('/categories', authMiddleware, CategoryController.index);
routes.post('/categories', authMiddleware, CategoryController.create);
routes.get('/categories/:id', authMiddleware, CategoryController.show);

routes.get('/products', authMiddleware, ProductController.index);
routes.post('/products', authMiddleware, ProductController.create);
routes.get('/products/:id', authMiddleware, ProductController.show);
routes.put('/products/:id', authMiddleware, ProductController.update);
routes.delete('/products/:id', authMiddleware, ProductController.destroy);

export default routes
