const requestCache = new Map();
const dataCache = new Map();

// Promise Coalescing to prevent duplicate simultaneous database requests
export async function fetchWithCoalescing<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }

  const promise = fetchFn().finally(() => {
    requestCache.delete(key);
  });

  requestCache.set(key, promise);

  return promise;
}

// TTL Cache (60 seconds) to avoid repeating requests across navigations
export function getCachedData<T>(key: string): T | null {
  const entry = dataCache.get(key);

  if (!entry) return null;

  if (Date.now() - entry.timestamp > 60000) {
    dataCache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCachedData<T>(key: string, data: T) {
  dataCache.set(key, {
    data,
    timestamp: Date.now()
  });
}
