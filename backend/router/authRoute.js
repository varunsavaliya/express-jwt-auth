import express from 'express';
import { login, logout, profile, signup } from '../controllers/authController.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

const authRouter = express.Router();

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.get('/profile', jwtAuth, profile)
authRouter.get('/logout', jwtAuth, logout)

export default authRouter;