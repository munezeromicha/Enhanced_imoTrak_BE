import express from 'express';
import { handleLogin } from './auth.controller.js';

const Authrouter = express.Router();

Authrouter.post('/login', handleLogin);

export default Authrouter;
