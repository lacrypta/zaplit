import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateShortId(str: string): string {
  const normalized = str.toLowerCase().replace(/\s+/g, '');

  // Create a numeric hash (DJB2 algorithm)
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to base36 (alphanumeric) and take first 6 chars
  return Math.abs(hash).toString(36).substring(0, 6);
}
