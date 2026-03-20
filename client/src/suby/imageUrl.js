// client/src/suby/imageUrl.js
// Resolves all image formats from MongoDB to a usable URL
// Works for both Cloudinary URLs and old local /uploads/ paths

import { API_URL } from './api';

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

const isDeadLocalFile = (str) =>
  /^\d{10,}(-\d+)?\.\w+$/.test(str);

/**
 * @param {string|null} image
 * @param {'suby-products'|'suby-firms'} folder
 */
export const resolveImageUrl = (image, folder = 'suby-products') => {
  if (!image) return null;

  // 1. Full Cloudinary or any https URL — use as-is
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  // 2. Local /uploads/ path (old saves, still works on local dev)
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`;

  // 3. Dead timestamp filename (Render wiped it) → null = show placeholder
  if (isDeadLocalFile(image)) return null;

  // 4. Bare Cloudinary public_id with folder e.g. "suby-firms/abc123"
  if (CLOUD && image.includes('/'))
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${image}`;

  // 5. Bare filename — try Cloudinary folder
  if (CLOUD)
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${folder}/${image}`;

  // 6. Last resort
  return `${API_URL}/uploads/${image}`;
};

export const getFirmImageUrl    = (image) => resolveImageUrl(image, 'suby-firms');
export const getProductImageUrl = (image) => resolveImageUrl(image, 'suby-products');
