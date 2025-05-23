import { login } from './auth.service';
import { Request, Response } from 'express';

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await login(req.body);
    res.json( token );
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
