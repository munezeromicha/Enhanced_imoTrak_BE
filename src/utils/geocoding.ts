import { AppError } from './Error';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/reverse';
const cache = new Map<string, { address: string; road: string; expires: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

export interface ReverseGeocodeResult {
  road: string;
  address: string;
  display_name: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> {
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    throw new AppError('Invalid coordinates', 400);
  }

  const key = cacheKey(latitude, longitude);
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return {
      road: cached.road,
      address: cached.address,
      display_name: cached.address,
    };
  }

  const url = new URL(NOMINATIM_BASE);
  url.searchParams.set('format', 'json');
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));
  url.searchParams.set('zoom', '18');
  url.searchParams.set('addressdetails', '1');

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'ImoTrak-Fleet-Tracker/1.0',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new AppError('Reverse geocoding failed', 502);
  }

  const data = (await response.json()) as {
    display_name?: string;
    address?: Record<string, string>;
  };

  const addr = data.address ?? {};
  const road =
    addr.road ||
    addr.pedestrian ||
    addr.footway ||
    addr.path ||
    addr.cycleway ||
    addr.residential ||
    'Unknown road';

  const parts = [
    road !== 'Unknown road' ? road : null,
    addr.suburb || addr.neighbourhood || addr.quarter,
    addr.city || addr.town || addr.village,
    addr.state || addr.region,
    addr.country,
  ].filter(Boolean);

  const address = parts.length > 0 ? parts.join(', ') : data.display_name ?? 'Unknown location';

  cache.set(key, { road, address, expires: Date.now() + CACHE_TTL_MS });

  return {
    road,
    address,
    display_name: data.display_name ?? address,
  };
}
