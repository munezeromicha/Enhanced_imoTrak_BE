import express from 'express';
import { handleLogin } from './auth.controller';

const Authrouter = express.Router();

Authrouter.post('/login', handleLogin);

export default Authrouter;
