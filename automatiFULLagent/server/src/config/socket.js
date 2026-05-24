let ioInstance;

export function registerSocketServer(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("user:subscribe", (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on("execution:subscribe", (executionId) => {
      if (executionId) {
        socket.join(`execution:${executionId}`);
      }
    });

    socket.on("execution:unsubscribe", (executionId) => {
      if (executionId) {
        socket.leave(`execution:${executionId}`);
      }
    });
  });
}

export function getSocketServer() {
  return ioInstance;
}
