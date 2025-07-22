import { PrismaClient } from '@prisma/client';
import { getRequestContext } from '../context/request-context';
import { logAudit } from '../utils/get-meta'; // your existing logger

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);

  const context = getRequestContext();
  const isWrite = ['create', 'update', 'delete'].includes(params.action);
  const skipLog = params.model === 'tbl_audit_logs';

  if (isWrite && context && !skipLog) {
    try {
      await logAudit({
        userId: context.userId,
        action: params.action.toUpperCase(),
        tableName: params.model ?? '',
        recordId: (
          params.args.where?.id ?? params.args.where?.user_id ?? ''
        ).toString(),
        oldValue: params.action === 'update' || params.action === 'delete' ? undefined : null,
        newValue: result,
        ip: context.ip,
        userAgent: context.userAgent,
      });
    } catch (err) {
      console.error('[Audit Log Error]', err);
    }
  }

  return result;
});

export default prisma;
