import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export const UserController = {
  getAll: async (req: Request, res: Response) => {
    const users = await UserService.getAll();
    res.json(users);
  },

  getById: async (req: Request, res: Response) => {
    const user = await UserService.getById(req.params.id);
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  },

  create: async (req: Request, res: Response) => {
    const newUser = await UserService.create(req.body);
    res.status(201).json(newUser);
  },

  update: async (req: Request, res: Response) => {
    const updatedUser = await UserService.update(req.params.id, req.body);
    res.json(updatedUser);
  },

  delete: async (req: Request, res: Response) => {
    await UserService.delete(req.params.id);
    res.status(204).send();
  },
};
