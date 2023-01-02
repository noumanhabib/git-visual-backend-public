const mongoose = require('mongoose');
const http = require('http');

const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const app = require('./app');
const config = require('./config/config');

const userService = require('./services/user.service');
const ApiError = require('./utils/ApiError');
const logger = require('./config/logger');

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

/**
 * Socket.io
 */
io.use(async (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    const { token } = socket.handshake.query;
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'authentication error'));
        return;
      }
      // eslint-disable-next-line no-param-reassign
      socket.userData = decoded;
      next();
    });
  } else {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'authentication error'));
  }
}).on('connection', (socket) => {
  // Connection now authenticated to receive further events
  socket.join(socket.userData.sub);
  userService.changeUserStatusById(socket.userData.sub, 'online');

  socket.on('typing', (data) => {
    socket.to(data.receiver).emit('typing', { conversationId: data.conversationId });
  });

  socket.on('stoppedTyping', (data) => {
    socket.to(data.receiver).emit('stoppedTyping', { conversationId: data.conversationId });
  });

  socket.on('disconnect', () => {
    socket.leave(socket.userData.sub);
    userService.changeUserStatusById(socket.userData.sub, 'offline');
  });
});

global.io = io;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
