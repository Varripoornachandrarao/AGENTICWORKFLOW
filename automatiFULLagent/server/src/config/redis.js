import IORedis from "ioredis";
import { env } from "./env.js";

let redisConnection;

export function getRedisConnection() {
  if (!env.redisUrl) {
    return null;
  }

  if (!redisConnection) {
    redisConnection = new IORedis(env.redisUrl, {
      maxRetriesPerRequest: null
    });
  }

  return redisConnection;
}
