import {
  GAME_STATUS_WAITING,
  GAME_STATUS_STARTED,
  GAME_STATUS_FINISHED,
  MILLISECONDS,
} from '../../enums/gameStatus.js';
import { captureException } from '../../utils/tracing.js';

export async function DOUBLE_GAME(gameRoom, socketConnection, redisClient) {
  try {
    const DELAY_TO_RESTART_GAME_IN_SECONDS = 5;
    const double_match = await redisClient.get('ws_double_match');

    const onRoom = socketConnection.sockets.in(gameRoom);
    
    if (!double_match) {
      onRoom.emit('out', { message: 'The game is out of air' });
      return;
    }

    const double_match_parsed = JSON.parse(double_match);
    const { starts_at, ends_at } = double_match_parsed;

    let game_status = '';
    let elapsed_time = 0;

    const dateNow = new Date().getTime() / MILLISECONDS;

    /*
     * ends_at é enviado apenas após começar a partida
     */
    if (dateNow <= starts_at) {
      game_status = GAME_STATUS_WAITING;
      elapsed_time = starts_at - dateNow;
    } else if (dateNow >= starts_at && dateNow <= ends_at) {
      game_status = GAME_STATUS_STARTED;
      elapsed_time = dateNow - starts_at;
    } else if (dateNow >= starts_at && dateNow >= ends_at) {
      elapsed_time = dateNow - ends_at;
      game_status = GAME_STATUS_FINISHED;
    }

    const data = {
      ...double_match_parsed,
      game_status,
      elapsed_time,
    };

    if (!game_status) return;

    onRoom.emit('tick', data);
  } catch (e) {
    captureException(e);
  }
}
