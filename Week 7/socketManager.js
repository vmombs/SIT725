const { Server } = require("socket.io");

let io;

module.exports = {
  initialize: (server) => {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.IO not initialized. Call initialize(server) first.");
    }
    return io;
  },
};