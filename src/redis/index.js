import { createClient } from 'redis';

const clientConnect = async (hasAuth) => {
  const { REDIS_USER, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

  let client;

  if (hasAuth) {
    client = createClient({
      url: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
    });
  } else {
    client = createClient(REDIS_PORT, REDIS_HOST);
  }

  client.on('connect', () => console.log('Redis is connected!'));
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  return client;
};

export default clientConnect;
