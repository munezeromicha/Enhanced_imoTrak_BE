import { NextFunction, Request, Response } from 'express';
import * as issueService from '../services/vehicleIssue.service';
import { position_accesses } from '../types/access';
import { AppError } from '../utils/Error';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    position_id: string;
    organization_id: string;
    position_access: position_accesses;
  };
}


export const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.position_access?.vehicleIssues?.view) {
      throw new AppError('Access denied. You are not allowed to view vehicle issues.', 403);
    }

    const issues = await issueService.getAllIssues(req.user);

    res.status(200).json({
      message: 'Vehicle issues retrieved successfully.',
      data: issues,
    });

  } catch (err: any) {
    next(err);
  }
};

export const getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.position_access?.vehicleIssues?.view) {
      throw new AppError('Access denied. U are not allowed to view this vehicle issue.', 403);
    }
    const issue = await issueService.getIssueById(req.params.id, req.user);
    
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json({
      message: 'issue retrieved successfully',
      data:issue
    });
      
  } catch (error) {
    next(error)
  }
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.position_access?.vehicleIssues?.report) {
    throw new AppError('Access denied. U are not allowed to create vehicle issues.', 403);
  }
  const { issue_title, issue_description, reserved_vehicle_id, issue_date } = req.body;
  const newIssue = await issueService.createIssue({ issue_title, issue_description, reserved_vehicle_id, issue_date }, req.user);
  res.status(201).json(newIssue);
};

export const update = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.position_access?.vehicleIssues?.update) {
    throw new AppError('Access denied. U are not allowed to edit vehicle issues.', 403);
  }
  const issue = await issueService.getIssueById(req.params.id, req.user);

  if (issue?.issue_status === 'CLOSED') {
    throw new AppError('Cannot update a closed issue.', 400);
  }
  const updatedIssue = await issueService.updateIssue(req.params.id, req.body, req.user);
  res.json(updatedIssue);
};

export const remove = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.position_access?.vehicleIssues?.delete) {
    throw new AppError('Access denied. U are not allowed to delete vehicle issues.', 403);
  }
  await issueService.deleteIssue(req.params.id);
  res.status(204).send();
};
