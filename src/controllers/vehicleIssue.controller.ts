import { NextFunction, Request, Response } from 'express';
import * as issueService from '../services/vehicleIssue.service';
import { position_accesses } from '../types/access';
import { AppError } from '../utils/Error';
import { updateVehicleIssueMessageSchema } from '../schemas/vehicleIssue.schema';
import { approveReplacementSchema } from '../schemas/driver.schema';
import { assertOrganizationDriverManagement } from '../utils/driverAccess';
import { authOf, type AuthorizedRequest } from '../middlewares/requirePermission';
import { readableUnitIds } from '../utils/authContext';

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

    const issues = await issueService.getAllIssues(req.user, readableUnitIds(authOf(req as unknown as AuthorizedRequest)));

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
      throw new AppError('Access denied. You are not allowed to view this vehicle issue.', 403);
    }
    const issue = await issueService.getIssueById(req.params.id, req.user, readableUnitIds(authOf(req as unknown as AuthorizedRequest)));
    
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json({
      message: 'Issue retrieved successfully',
      data: issue
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.position_access?.vehicleIssues?.report) {
      throw new AppError('Access denied. You are not allowed to create vehicle issues.', 403);
    }
    const { issue_title, issue_description, reserved_vehicle_id, issue_date, severity_level, replacement_requested } = req.body;
    const newIssue = await issueService.createIssue(
      { issue_title, issue_description, reserved_vehicle_id, issue_date, severity_level, replacement_requested },
      req.user
    );
    res.status(201).json(newIssue);
  } catch (err: any) {
    next(err);
  }
};

export const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.position_access?.vehicleIssues?.update) {
      throw new AppError('Access denied. You are not allowed to edit vehicle issues.', 403);
    }
    const issue = await issueService.getIssueById(req.params.id, req.user, readableUnitIds(authOf(req as unknown as AuthorizedRequest)));

    if (issue?.issue_status === 'CLOSED') {
      throw new AppError('Cannot update a closed issue.', 400);
    }
    const updatedIssue = await issueService.updateIssue(req.params.id, req.body, req.user);
    res.json(updatedIssue);
  } catch (err: any) {
    next(err);
  }
};

export const remove = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.position_access?.vehicleIssues?.delete) {
      throw new AppError('Access denied. You are not allowed to delete vehicle issues.', 403);
    }
    await issueService.deleteIssue(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    next(err);
  }
};

export const updateMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.position_access?.vehicleIssues?.update) {
      throw new AppError('Access denied. You are not allowed to update vehicle issue messages.', 403);
    }

    const { message } = updateVehicleIssueMessageSchema.parse(req.body);
    const issueId = req.params.id;
    
    const updatedIssue = await issueService.updateIssueMessage(issueId, message, req.user);
    
    res.status(200).json({
      message: 'Vehicle issue message updated successfully',
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

export const addReply = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const issueId = req.params.id;
    const reply_content =
      req.body.reply_content ?? req.body.replyContent;
    if (!reply_content) {
      throw new AppError('Reply content is required', 400);
    }
    const reply = await issueService.addIssueReply(issueId, reply_content, req.user!);
    res.status(201).json({
      message: 'Reply added successfully',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

export const approveReplacement = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const canAssignToReservation =
      req.user?.position_access?.reservations?.update &&
      req.user?.position_access?.reservations?.view;
    const canManageIssues = req.user?.position_access?.vehicleIssues?.update;

    if (!canAssignToReservation && !canManageIssues) {
      throw new AppError(
        'Access denied. You need reservation assignment or vehicle issue management permissions.',
        403
      );
    }

    assertOrganizationDriverManagement(req);

    const issueId = req.params.id;
    const { replacement_vehicle_id, replacement_driver_id, staff_message } =
      approveReplacementSchema.parse(req.body);

    const updatedIssue = await issueService.approveVehicleReplacement(
      issueId,
      replacement_vehicle_id,
      replacement_driver_id,
      req.user!,
      staff_message
    );
    res.status(200).json({
      message:
        'Additional vehicle and driver assigned. Issue remains open until closed by the reporter.',
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

export const closeIssue = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const issueId = req.params.id;
    const closingNote =
      typeof req.body?.closing_note === 'string'
        ? req.body.closing_note
        : undefined;

    const updatedIssue = await issueService.closeIssueByUser(
      issueId,
      req.user!,
      closingNote
    );

    res.status(200).json({
      message: 'Issue closed successfully',
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};
