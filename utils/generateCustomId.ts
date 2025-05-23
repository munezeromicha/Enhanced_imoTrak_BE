export function generateCustomId(orgName: string): string {
  const words = orgName
    .split(/\s+/)
    .map(w => w[0].toUpperCase())
    .join('');
  const year = new Date().getFullYear().toString().slice(-2);
  return `${words}-${year}`;
}