import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from 'jsonwebtoken';
import jwksClient, { JwksClient } from 'jwks-rsa';

let cachedClient: JwksClient | null = null;
let cachedIssuer: string | null = null;

export function getSsoIssuer(): string {
  const issuer = (process.env.SSO_ISSUER || '').trim().replace(/\/+$/, '');
  if (!issuer) {
    throw new Error('SSO_ISSUER is not configured');
  }
  return issuer;
}

function getJwksClient(): JwksClient {
  const issuer = getSsoIssuer();
  if (!cachedClient || cachedIssuer !== issuer) {
    cachedIssuer = issuer;
    cachedClient = jwksClient({
      jwksUri: `${issuer}/jwks`,
      cache: true,
      cacheMaxAge: 10 * 60 * 1000,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }
  return cachedClient;
}

function getSigningKey(header: JwtHeader, callback: SigningKeyCallback) {
  if (!header.kid) {
    callback(new Error('SSO token is missing kid'));
    return;
  }
  getJwksClient().getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, key?.getPublicKey());
  });
}

export type SsoActingFor = {
  id?: string;
  name?: string;
  position?: string;
  unit_type?: string;
  unit?: string;
};

export type SsoIdentity = {
  sub: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
  position?: string;
  unit_type?: string;
  unit?: string;
  role?: string;
  is_acting?: boolean;
  acting_for?: SsoActingFor[];
  picture?: string;
  gender?: string;
  date_of_birth?: string;
  phone_number?: string;
};

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

export function claimsToIdentity(payload: JwtPayload): SsoIdentity {
  const sub = asString(payload.sub);
  if (!sub) {
    throw new Error('SSO token is missing sub');
  }

  const actingFor = Array.isArray(payload.acting_for)
    ? (payload.acting_for as unknown[]).filter(
        (item): item is SsoActingFor => !!item && typeof item === 'object'
      )
    : undefined;

  return {
    sub,
    name: asString(payload.name),
    email: asString(payload.email)?.toLowerCase(),
    email_verified: asBoolean(payload.email_verified),
    position: asString(payload.position),
    unit_type: asString(payload.unit_type),
    unit: asString(payload.unit),
    role: asString(payload.role),
    is_acting: asBoolean(payload.is_acting),
    acting_for: actingFor,
    picture: asString(payload.picture),
    gender: asString(payload.gender),
    date_of_birth: asString(payload.date_of_birth),
    phone_number: asString(payload.phone_number),
  };
}

/**
 * Validate an Inuma ID or access token against the issuer JWKS.
 * Audience is checked when SSO_CLIENT_ID is set; access tokens may use a
 * different aud, so we retry without audience if the first verify fails.
 */
export async function verifySsoToken(token: string): Promise<SsoIdentity> {
  const issuer = getSsoIssuer();
  const audience = (process.env.SSO_CLIENT_ID || '').trim() || undefined;

  const verifyOnce = (options: jwt.VerifyOptions) =>
    new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token, getSigningKey, options, (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
          reject(err || new Error('Invalid SSO token'));
          return;
        }
        resolve(decoded);
      });
    });

  const baseOptions: jwt.VerifyOptions = {
    issuer,
    algorithms: ['RS256', 'ES256'],
  };

  let payload: JwtPayload;
  try {
    payload = await verifyOnce(
      audience ? { ...baseOptions, audience } : baseOptions
    );
  } catch (firstError) {
    if (!audience) {
      throw firstError;
    }
    payload = await verifyOnce(baseOptions);
  }

  return claimsToIdentity(payload);
}

export function extractBearerToken(authorization?: string): string | undefined {
  if (!authorization) return undefined;
  const [scheme, token] = authorization.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return undefined;
  return token;
}
