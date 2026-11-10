import { createClient } from 'redis';
import { env } from '../config/env';

export const redis = createClient({ url: env.REDIS_URL });
redis.on('error', (error) => console.error('Redis error:', error));

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis.isReady) return null;
  try {
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error(`Redis get failed for ${key}:`, error);
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds = 60) {
  if (!redis.isReady) return;
  try {
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.error(`Redis set failed for ${key}:`, error);
  }
}

export async function deleteCacheByPrefix(prefix: string) {
  if (!redis.isReady) return;
  try {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length > 0) await redis.del(keys);
  } catch (error) {
    console.error(`Redis invalidation failed for ${prefix}:`, error);
  }
}
