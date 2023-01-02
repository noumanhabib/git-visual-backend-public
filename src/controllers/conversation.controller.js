const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { conversationService, socketService } = require('../services');

const initiateConversation = catchAsync(async (req, res) => {
  const conversationBody = {
    members: [req.user.id, req.body.receiverId],
  };
  console.log(conversationBody);

  const conversation = await conversationService.createConversation(conversationBody);

  console.log(conversation);
  socketService.initiateConversation({
    conversation,
    receiver: req.body.receiver,
  });

  res.send(conversation);
});

const sendMessage = catchAsync(async (req, res) => {
  const messagebody = {
    conversationId: req.body.conversationId,
    sender: req.user.id,
    receiver: req.body.receiver,
    messageType: req.body.messageType,
    ...(req.body.messageType === 'text' && { text: req.body.text }),
    ...(req.body.messageType === 'media' && { mediaUrl: req.file.path.replace('public', '') }),
  };

  const message = await conversationService.createMessage(messagebody);
  const update = {
    $inc: { messageCount: 1 },
  };

  await conversationService.updateConversationById(req.body.conversationId, update);

  socketService.sendMessage({
    message,
    receiver: req.body.receiver,
  });

  res.sendStatus(httpStatus.CREATED);
});

const getUserConversations = catchAsync(async (req, res) => {
  const conversations = await conversationService.getConversationsByUserId(req.user.id);
  res.send(conversations);
});

const getMessagesForConversation = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['conversationId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await conversationService.queryMessagesByConversationId(filter, options);
  res.send(result);
});

const readMessages = catchAsync(async (req, res) => {
  const receiverId = res.locals.conversation.members.filter((member) => !member.equals(req.user.id));

  await conversationService.readMessages(req.body.messageIds);

  socketService.sendReadMessages({
    messageIds: req.body.messageIds,
    receiver: receiverId[0].toString(),
    conversationId: res.locals.conversation._id,
  });
  res.sendStatus(httpStatus.OK);
});

module.exports = {
  sendMessage,
  readMessages,
  getMessagesForConversation,
  getUserConversations,
  initiateConversation,
};
