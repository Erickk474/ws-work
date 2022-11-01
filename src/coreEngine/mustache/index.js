import {
  GAME_STATUS_WAITING,
  GAME_STATUS_STARTED,
  GAME_STATUS_FINISHED,
  MILLISECONDS,
} from '../../enums/gameStatus.js';

export async function MUSTACHE_GAME(gameRoom, socketConnection, redisClient) {
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
  const newEnds_at = ends_at - DELAY_TO_RESTART_GAME_IN_SECONDS;

  /*
   * ends_at é enviado apenas após começar a partida
   */
  if (dateNow <= starts_at) {
    game_status = GAME_STATUS_WAITING;
    elapsed_time = starts_at - dateNow;
  } else if (dateNow >= starts_at && dateNow <= newEnds_at) {
    game_status = GAME_STATUS_STARTED;
    double_match_parsed.countdown_number =
      double_match_parsed.countdown_number - DELAY_TO_RESTART_GAME_IN_SECONDS;
    elapsed_time = dateNow - starts_at;
  } else if (dateNow >= starts_at && dateNow >= newEnds_at) {
    elapsed_time = dateNow - newEnds_at;
    double_match_parsed.countdown_number = DELAY_TO_RESTART_GAME_IN_SECONDS;
    game_status = GAME_STATUS_FINISHED;
  }

  const data = {
    ...double_match_parsed,
    newEnds_at,
    game_status,
    elapsed_time: elapsed_time * MILLISECONDS,
  };

  if (!game_status) return;

  onRoom.emit('tick', data);
}
