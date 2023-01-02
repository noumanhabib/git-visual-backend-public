const sendMessage = (data) => {
  const { io } = global;

  const { message, receiver } = data;
  io.sockets.in(receiver).emit('newMessage', message);
};

const sendReadMessages = (data) => {
  const { io } = global;

  const { messageIds, conversationId, receiver } = data;
  io.sockets.in(receiver).emit('readMessages', {
    messageIds,
    conversationId,
  });
};

const initiateConversation = (data) => {
  const { io } = global;

  const { receiver, conversation } = data;
  io.sockets.in(receiver).emit('newConversation', conversation);
};

const sendActivityStatus = (data) => {
  const { io } = global;

  const { user, userId, activityStatus } = data;
  io.sockets.in(userId).emit('activityStatusUpdate', {
    activityStatus,
    user,
  });
};

module.exports = {
  sendMessage,
  sendReadMessages,
  initiateConversation,
  sendActivityStatus,
};
