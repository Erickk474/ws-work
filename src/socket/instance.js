export function socketInstance(socketConnection, redisClient) {
  socketConnection.on('connection', (socket) => {
    socket.on('error', (error) => {
      console.log('error', error);
    });

    socket.on('connection_error', (error) => {
      console.log('connection_error', error);
    });

    socket.on('join-in-room', (data) => {
      socket.join(data);
      socket.emit('joined', true);
    });

    socket.on('leave-out-room', (data) => {
      socket.leave(data);
      socket.emit('leaved-room', data);
    });

    socket.on('hand-shake', (data) => {
      redisClient.set(data, socket.id);
    });

    socket.on('check-rooms', () => {
      console.log('Rooms', socket.rooms);
    });
  });
}
