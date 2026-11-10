import { app } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import { connectRedis, redis } from './lib/redis';

async function start() {
  try {
    await connectRedis();
    console.log('Redis cache connected');
  } catch (error) {
    console.error('Redis unavailable; starting without cache:', error);
  }
  return app.listen(env.PORT, () => console.log(`Pokédex API listening on port ${env.PORT}`));
}

void start().then((server) => {
  const shutdown = async () => {
    if (redis.isOpen) await redis.quit();
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}).catch((error) => {
  console.error('Unable to start API:', error);
  process.exitCode = 1;
});
