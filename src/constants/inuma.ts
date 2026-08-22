/** Inuma public API position names that may approve ImoTrak access. */
export const INUMA_APPROVER_POSITIONS = [
  'Director of Assets and Services Management',
  'Assets & Services Management Division Manager-HO',
  'Assets and Services management 2',
] as const;

export const INUMA_APPROVER_IMOTRAK_POSITION = 'Assets & Services Administrator';

export const INUMA_APPROVER_UNIT_NAMES = ['UR-Fleet', 'UR Fleet'] as const;

export const PENDING_APPROVAL_MESSAGE =
  'Your account has been successfully authenticated. Please contact an authorized Assets and Services Management administrator to grant you access to ImoTrak.';

export function normalizeCatalogName(value?: string | null): string {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Campus-aware name key used to decide whether an Inuma campus already exists
 * as a unit.
 *
 * The catalog and the units created by hand disagree about the "UR" prefix —
 * "UR - Busogo Campus", "UR Busogo Campus" and "Busogo Campus" are all the
 * same place. Matching on `normalizeCatalogName` alone treated them as three
 * campuses and created a duplicate unit on every sync, which is why some
 * organizations list the same campus twice.
 */
export function normalizeCampusName(value?: string | null): string {
  return normalizeCatalogName(value)
    // Drop a leading "ur" token, with or without a separator after it.
    .replace(/^ur\s*[-–—:]?\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isAuthorizedInumaApproverPosition(positionName?: string | null): boolean {
  const normalized = normalizeCatalogName(positionName);
  if (!normalized) return false;
  return INUMA_APPROVER_POSITIONS.some(
    (name) => normalizeCatalogName(name) === normalized
  );
}
