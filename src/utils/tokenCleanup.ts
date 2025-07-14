import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cleanupExpiredTokens(): Promise<void> {
  try {
    const now = new Date();
    const result = await prisma.tbl_jwt_blacklist.deleteMany({
      where: {
        expires_at: {
          lt: now
        }
      }
    });

    console.log(`Cleaned up ${result.count} expired tokens`);
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}

// Schedule cleanup every hour
export function startTokenCleanupScheduler(): void {
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000); // Run every hour

  // Also run cleanup on startup
  cleanupExpiredTokens();
} 