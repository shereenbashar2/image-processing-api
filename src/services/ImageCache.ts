const imageCache: { [key: string]: string } = {};

/**
 * Retrieves a cached image file path based on a provided cache key.
 * @param key - The cache key.
 * @returns The cached image file path or undefined if not found.
 */
export const getFromCache = (key: string): string | undefined => {
  return imageCache[key];
};

/**
 * Adds a cache entry for a specific cache key and image file path.
 * @param - The cache key.
 * @param - The image file path to be cached.
 */
export const addToCache = (key: string, imagePath: string): void => {
  imageCache[key] = imagePath;
};
