import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const prisma = new PrismaClient();

async function archiveOldAuditLogs() {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  try {
    const oldLogs = await prisma.tbl_audit_logs.findMany({
      where: { timestamp: { lt: twoWeeksAgo } },
    });

    if (!oldLogs.length) {
      console.log('No logs to archive');
      return;
    }

    const archiveDir = path.join(__dirname, '../../archives');
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    const archivePath = path.join(archiveDir, `audit-logs-${Date.now()}.zip`);
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.append(JSON.stringify(oldLogs, null, 2), { name: 'audit-logs.json' });

    await archive.finalize();
    console.log(`Archived ${oldLogs.length} logs to ${archivePath}`);

    await prisma.tbl_audit_logs.deleteMany({ where: { timestamp: { lt: twoWeeksAgo } } });
    console.log('Old logs deleted');
  } catch (error) {
    console.error('Error archiving logs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Runs every 2 weeks on Sunday at midnight
const job = new CronJob('0 0 * * 0', archiveOldAuditLogs);
job.start();
