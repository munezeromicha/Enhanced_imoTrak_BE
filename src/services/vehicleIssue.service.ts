import { PrismaClient,  tbl_vehicle_issues } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllIssues = async () => {
  return prisma.tbl_vehicle_issues.findMany();
};

export const getIssueById = async (id: string) => {
  return prisma.tbl_vehicle_issues.findUnique({
    where: { issue_id: id },
  });
};

export const createIssue = async (data: {
  issue_title: string;
  issue_description: string;
  reserved_vehicle_id: string;
  issue_date?: Date;
}) => {
  return prisma.tbl_vehicle_issues.create({
    data,
  });
};

export const updateIssue = async (id: string, data: Partial<{ issue_title: string; issue_description: string; reserved_vehicle_id: string; issue_date?: Date }>) => {
  return prisma.tbl_vehicle_issues.update({
    where: { issue_id: id },
    data,
  });
};

export const deleteIssue = async (id: string) => {
  return prisma.tbl_vehicle_issues.delete({
    where: { issue_id: id },
  });
};
