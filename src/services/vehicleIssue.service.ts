import { PrismaClient,  tbl_vehicle_issues } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllIssues = async () => {
  const issues = await prisma.tbl_vehicle_issues.findMany();
  if (!issues || issues.length === 0) {
    throw new Error('No vehicle issues found');
  }
  return issues;
};

export const getIssueById = async (id: string) => {
  return prisma.tbl_vehicle_issues.findUnique({
    where: { issue_id: id },
    select: {
      issue_id: true,
      issue_title: true,
      issue_description: true,
      issue_date: true,
      created_at: true,
      reserved_vehicle_id: true,
      issue_status: true,
    },
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
