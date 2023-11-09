const imageCache: { [key: string]: string } = {};
//:Retrieves a cached image file path based on a provided cache key.
export const getFromCache = (key: string): string | undefined => {
  return imageCache[key];
};
//Adds a cache entry for a specific cache key and image file path.
export const addToCache = (key: string, imagePath: string): void => {
  imageCache[key] = imagePath;
};
