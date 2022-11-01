import {
  GAME_STATUS_WAITING,
  GAME_STATUS_STARTED,
  GAME_STATUS_FINISHED,
  MILLISECONDS,
} from '../../enums/gameStatus.js';
import { captureException } from '../../utils/tracing.js';

export async function CRASH_GAME(gameRoom, socketConnection, redisClient) {
  try {
    const crash_match = await redisClient.get('ws_crash_match');

    const onRoom = socketConnection.sockets.in(gameRoom);

    if (!crash_match) {
      onRoom.emit('out', { message: 'The game is out of air' });
      return;
    }

    const crash_match_parsed = JSON.parse(crash_match);

    const { starts_at, final_multiplier } = crash_match_parsed;

    const startsAtDate = new Date(starts_at * MILLISECONDS);
    const dateNow = new Date();

    const game_status =
      startsAtDate > dateNow
        ? GAME_STATUS_WAITING
        : final_multiplier
        ? GAME_STATUS_FINISHED
        : GAME_STATUS_STARTED;
    crash_match_parsed.game_status = game_status;

    let elapsed_time = 0;

    if (dateNow <= starts_at) {
      game_status = GAME_STATUS_WAITING;
      elapsed_time = new Date(starts_at * MILLISECONDS - dateNow.getTime());
    }

    const game_progress = countGameProgress(elapsed_time);

    onRoom.emit('tick', {
      ...crash_match_parsed,
      game_progress,
      game_status,
      elapsed_time,
    });
  } catch (e) {
    captureException(e);
  }
}

function countGameProgress(seconds) {
  return Math.pow(10, seconds / 35);
}
