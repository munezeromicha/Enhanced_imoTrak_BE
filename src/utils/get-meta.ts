import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LogAuditParams {
  userId: string;
  action: string;
  tableName?: string;
  recordId?: string;
  oldValue?: any;
  newValue?: any;
  ip: string;
  userAgent: string;
}

export async function logAudit({
  userId,
  action,
  tableName,
  recordId,
  oldValue,
  newValue,
  ip,
  userAgent,
}: LogAuditParams) {
  await prisma.tbl_audit_logs.create({
    data: {
      user_id: userId,
      action,
      table_name: tableName,
      record_id: recordId,
      old_value: oldValue,
      new_value: newValue,
      ip_address: ip,
      user_agent: userAgent,
    },
  });
}
