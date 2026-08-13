import { createPublicKey, JsonWebKey } from 'crypto';
import jwt, { JwtHeader, JwtPayload } from 'jsonwebtoken';

type Jwks = { keys?: JsonWebKey[] };

let cachedKeys: JsonWebKey[] = [];
let cachedAt = 0;
let cachedIssuer: string | null = null;
const CACHE_MS = 10 * 60 * 1000;

export function getSsoIssuer(): string {
  const issuer = (process.env.SSO_ISSUER || '').trim().replace(/\/+$/, '');
  if (!issuer) {
    throw new Error('SSO_ISSUER is not configured');
  }
  return issuer;
}

async function loadJwks(issuer: string): Promise<JsonWebKey[]> {
  const fresh = Date.now() - cachedAt < CACHE_MS && cachedIssuer === issuer && cachedKeys.length > 0;
  if (fresh) {
    return cachedKeys;
  }

  const response = await fetch(`${issuer}/jwks`);
  if (!response.ok) {
    throw new Error(`Failed to load SSO JWKS (${response.status})`);
  }

  const body = (await response.json()) as Jwks;
  const keys = Array.isArray(body.keys) ? body.keys : [];
  if (keys.length === 0) {
    throw new Error('SSO JWKS did not return any keys');
  }

  cachedKeys = keys;
  cachedAt = Date.now();
  cachedIssuer = issuer;
  return keys;
}

function pemForKid(keys: JsonWebKey[], kid?: string): string {
  const jwk = (kid ? keys.find((key) => key.kid === kid) : undefined) || keys[0];
  if (!jwk) {
    throw new Error('SSO token signing key was not found in JWKS');
  }

  return createPublicKey({ key: jwk, format: 'jwk' }).export({
    type: 'spki',
    format: 'pem',
  }) as string;
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
  const header = jwt.decode(token, { complete: true })?.header as JwtHeader | undefined;
  const keys = await loadJwks(issuer);
  const publicKey = pemForKid(keys, header?.kid);

  const baseOptions: jwt.VerifyOptions = {
    issuer,
    algorithms: ['RS256', 'ES256'],
  };

  let payload: JwtPayload;
  try {
    payload = jwt.verify(
      token,
      publicKey,
      audience ? { ...baseOptions, audience } : baseOptions
    ) as JwtPayload;
  } catch (firstError) {
    if (!audience) {
      throw firstError;
    }
    payload = jwt.verify(token, publicKey, baseOptions) as JwtPayload;
  }

  return claimsToIdentity(payload);
}

export function extractBearerToken(authorization?: string): string | undefined {
  if (!authorization) return undefined;
  const [scheme, token] = authorization.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return undefined;
  return token;
}
