import { Request, Response } from 'express';
import * as issueService from '../services/vehicleIssue.service';

export const getAll = async (_req: Request, res: Response) => {
  const issues = await issueService.getAllIssues();
  res.json(issues);
};

export const getById = async (req: Request, res: Response) => {
  const issue = await issueService.getIssueById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  res.json(issue);
};

export const create = async (req: Request, res: Response) => {
  const { issue_description, reserved_vehicle_id } = req.body;
  const newIssue = await issueService.createIssue({ issue_description, reserved_vehicle_id });
  res.status(201).json(newIssue);
};

export const update = async (req: Request, res: Response) => {
  const updatedIssue = await issueService.updateIssue(req.params.id, req.body);
  res.json(updatedIssue);
};

export const remove = async (req: Request, res: Response) => {
  await issueService.deleteIssue(req.params.id);
  res.status(204).send();
};
