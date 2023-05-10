import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
// import { createClient } from 'redis';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async setCache(key: string, value: any, expiresIn?: number) {
    const redisValue = JSON.stringify(value);
    await this.cacheService.set(key, redisValue, expiresIn);
  }

  async get(key: string) {
    const redisValue = await await this.cacheService.get(key);
    if (redisValue) {
      return JSON.parse(redisValue as string);
      //return redisValue;
    }
    return null;
  }

  async delete(key: string) {
    //const redisClient = await this.redisService.getClient();
    await this.cacheService.del(key);
  }
}
