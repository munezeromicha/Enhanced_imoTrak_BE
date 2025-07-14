import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

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
}: LogAuditParams): Promise<void> {
  try {
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
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}

export function getRequestMeta(req: Request): { ip: string; userAgent: string } {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.headers['x-real-ip']?.toString() ||
    req.socket?.remoteAddress ||
    '';

  const userAgent = req.headers['user-agent'] || '';

  return {
    ip,
    userAgent,
  };
}
