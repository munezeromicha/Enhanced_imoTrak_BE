import { Request, Response, NextFunction } from 'express';
import { createHash, timingSafeEqual } from 'crypto';
import { AppError } from '../utils/Error';

/**
 * Authentication for GPS trackers.
 *
 * The location-ingest endpoint cannot use a user token — the hardware posting
 * to it has no login and no way to refresh one — so it was left with no
 * authentication at all, which meant anyone who knew a vehicle id could write
 * and broadcast positions. This gives the devices a credential of their own
 * without pretending they are users.
 *
 * The key is read from `GPS_DEVICE_KEY` and accepted from either
 * `X-Device-Key` or `Authorization: Device <key>`, because trackers differ in
 * which headers they can be configured to send.
 *
 * Comparison is constant-time over SHA-256 digests: hashing first keeps the
 * comparison length-independent, so neither the value nor the length of the
 * configured key leaks through timing.
 */

function digest(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest();
}

function presentedKey(req: Request): string | null {
  const header = req.headers['x-device-key'];
  if (typeof header === 'string' && header.trim()) return header.trim();

  const auth = req.headers.authorization;
  if (typeof auth === 'string' && auth.toLowerCase().startsWith('device ')) {
    const value = auth.slice(7).trim();
    if (value) return value;
  }
  return null;
}

export function authenticateDevice(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const configured = process.env.GPS_DEVICE_KEY;

    // Fail closed. An unset key used to mean "anyone may post"; it now means
    // the ingest endpoint is closed until the key is deliberately configured.
    if (!configured || !configured.trim()) {
      throw new AppError(
        'Location ingest is not configured. Set GPS_DEVICE_KEY to enable it.',
        503
      );
    }

    const presented = presentedKey(req);
    if (!presented) {
      throw new AppError('Device credential required', 401);
    }

    if (!timingSafeEqual(digest(presented), digest(configured.trim()))) {
      throw new AppError('Invalid device credential', 401);
    }

    next();
  } catch (error) {
    next(error);
  }
}
