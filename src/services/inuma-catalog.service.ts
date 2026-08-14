import { AppError } from '../utils/Error';
import { normalizeCatalogName } from '../constants/inuma';

export type InumaCampus = {
  _id: string;
  name: string;
  code?: string;
  is_active?: boolean;
};

export type InumaPosition = {
  _id: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

export type InumaCatalog = {
  campuses: InumaCampus[];
  positions: InumaPosition[];
};

let cachedCatalog: InumaCatalog | null = null;
let cachedAt = 0;
const CACHE_MS = 15 * 60 * 1000;

function getInumaApiBaseUrl(): string {
  return (process.env.INUMA_API_BASE_URL || 'https://dev-inuma.ur.ac.rw/api').replace(
    /\/+$/,
    ''
  );
}

function getInumaApiKey(): string {
  const key = (process.env.INUMA_API_KEY || '').trim();
  if (!key) {
    throw new AppError('INUMA_API_KEY is not configured on the server', 500);
  }
  return key;
}

async function fetchInumaCollection<T>(
  path: string,
  collectionKey: string
): Promise<T[]> {
  const response = await fetch(`${getInumaApiBaseUrl()}${path}`, {
    headers: {
      'x-api-key': getInumaApiKey(),
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new AppError(`Failed to load Inuma catalog (${response.status})`, 502);
  }

  const body = (await response.json()) as {
    success?: boolean;
    data?: Record<string, T[]>;
  };

  const items = body.data?.[collectionKey];
  return Array.isArray(items) ? items : [];
}

export async function getInumaCatalog(forceRefresh = false): Promise<InumaCatalog> {
  const fresh =
    !forceRefresh && cachedCatalog && Date.now() - cachedAt < CACHE_MS;
  if (fresh && cachedCatalog) {
    return cachedCatalog;
  }

  const [campuses, positions] = await Promise.all([
    fetchInumaCollection<InumaCampus>('/campuses/public', 'campuses'),
    fetchInumaCollection<InumaPosition>('/positions/public', 'positions'),
  ]);

  cachedCatalog = { campuses, positions };
  cachedAt = Date.now();
  return cachedCatalog;
}

export function findInumaCampus(
  catalog: InumaCatalog,
  campusName?: string | null
): InumaCampus | undefined {
  const normalized = normalizeCatalogName(campusName);
  if (!normalized) return undefined;

  return catalog.campuses.find((campus) => {
    const byName = normalizeCatalogName(campus.name) === normalized;
    const byCode = normalizeCatalogName(campus.code) === normalized;
    return byName || byCode;
  });
}

export function findInumaPosition(
  catalog: InumaCatalog,
  positionName?: string | null
): InumaPosition | undefined {
  const normalized = normalizeCatalogName(positionName);
  if (!normalized) return undefined;

  return catalog.positions.find(
    (position) => normalizeCatalogName(position.name) === normalized
  );
}

export function isKnownInumaPosition(
  catalog: InumaCatalog,
  positionName?: string | null
): boolean {
  return !!findInumaPosition(catalog, positionName);
}

export function isKnownInumaCampus(
  catalog: InumaCatalog,
  campusName?: string | null
): boolean {
  return !!findInumaCampus(catalog, campusName);
}
