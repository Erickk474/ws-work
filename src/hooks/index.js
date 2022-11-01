const roomManager = async ({ req, res }, socketConnection) => {
  const { event, data } = req.body;
  socketConnection.to(req.params.id).emit(event, data);
  return res.send({
    message: 'event was emitted successfuly',
    ...req.body,
  });
};
const userManager = async ({ req, res }, socketConnection, redisClient) => {
  console.log(socketConnection);
  const { event, listener, data } = req.body;
  const socketId = await redisClient.get(listener);
  if (!socketId) {
    return res.status(400).send({
      message: 'event was not emitted',
      reason: 'listener not found',
    });
  }
  socketConnection.to(socketId).emit(event, data);
  return res.send({
    message: 'event was emitted successfuly',
    socketId,
    ...req.body,
  });
};
export { roomManager, userManager };
