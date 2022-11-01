import { CRASH_ROOM_NAME, DOUBLE_ROOM_NAME, MUSTACHE_ROOM_NAME } from '../socket/rooms.js';
import { CRASH_GAME } from './crash/index.js';
import { DOUBLE_GAME } from './double/index.js';
import { MUSTACHE_GAME } from './mustache/index.js';

export function CORE_ENGINE(socketConnection, redisClient) {
  setInterval(() => {
    CRASH_GAME(
      CRASH_ROOM_NAME,
      socketConnection,
      redisClient,
      process.env.TICK_TIMEOUT
    );
    DOUBLE_GAME(
      DOUBLE_ROOM_NAME,
      socketConnection,
      redisClient,
      process.env.TICK_TIMEOUT
    );
    MUSTACHE_GAME(
      MUSTACHE_ROOM_NAME,
      socketConnection,
      redisClient,
      process.env.TICK_TIMEOUT
    );
  }, process.env.TICK_TIMEOUT);
}
