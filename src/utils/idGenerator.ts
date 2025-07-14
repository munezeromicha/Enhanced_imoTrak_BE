// utils/idGenerator.ts
import { nanoid } from 'nanoid';

export const generateCustomId = (prefix: string) => {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `${prefix}-${date}-${nanoid(6).toUpperCase()}`;
};
