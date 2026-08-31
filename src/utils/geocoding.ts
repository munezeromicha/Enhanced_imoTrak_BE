import { AppError } from './Error';

const NOMINATIM_REVERSE = 'https://nominatim.openstreetmap.org/reverse';
const NOMINATIM_SEARCH = 'https://nominatim.openstreetmap.org/search';
const cache = new Map<string, { address: string; road: string; expires: number }>();
const searchCache = new Map<string, { results: LocationSearchResult[]; expires: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;
const SEARCH_CACHE_TTL_MS = 2 * 60 * 1000;

export interface LocationSearchResult {
  place_id: string;
  label: string;
  display_name: string;
  lat: number;
  lng: number;
  type: string;
  category: string;
  city: string | null;
  district: string | null;
  country: string | null;
}

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

function formatSearchLabel(
  displayName: string,
  address: Record<string, string> | undefined
): { label: string; city: string | null; district: string | null; country: string | null } {
  const addr = address ?? {};
  const city =
    addr.city || addr.town || addr.village || addr.municipality || addr.county || null;
  const district =
    addr.suburb ||
    addr.neighbourhood ||
    addr.quarter ||
    addr.district ||
    addr.state_district ||
    null;
  const country = addr.country || null;

  const primary =
    addr.road ||
    addr.amenity ||
    addr.building ||
    (addr.house_number && addr.road ? `${addr.house_number} ${addr.road}`.trim() : null) ||
    addr.name ||
    city;

  const parts = [primary, district, city, country].filter(Boolean);
  const label = parts.length > 0 ? parts.join(', ') : displayName;

  return { label, city, district, country };
}

export async function searchLocations(
  query: string,
  options: { limit?: number; countryCodes?: string } = {}
): Promise<LocationSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const limit = Math.min(Math.max(options.limit ?? 8, 1), 12);
  const countryCodes = options.countryCodes ?? 'rw';
  const cacheLookup = `${trimmed.toLowerCase()}|${countryCodes}|${limit}`;
  const cached = searchCache.get(cacheLookup);
  if (cached && cached.expires > Date.now()) {
    return cached.results;
  }

  const url = new URL(NOMINATIM_SEARCH);
  url.searchParams.set('q', trimmed);
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', String(limit));
  if (countryCodes) {
    url.searchParams.set('countrycodes', countryCodes);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'ImoTrak-Fleet-Tracker/1.0',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new AppError('Location search failed', 502);
  }

  const data = (await response.json()) as Array<{
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    type?: string;
    class?: string;
    address?: Record<string, string>;
  }>;

  const results: LocationSearchResult[] = data.map((item) => {
    const { label, city, district, country } = formatSearchLabel(
      item.display_name,
      item.address
    );
    return {
      place_id: String(item.place_id),
      label,
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type ?? item.class ?? 'place',
      category: item.class ?? 'place',
      city,
      district,
      country,
    };
  });

  searchCache.set(cacheLookup, { results, expires: Date.now() + SEARCH_CACHE_TTL_MS });
  return results;
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

  const url = new URL(NOMINATIM_REVERSE);
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
