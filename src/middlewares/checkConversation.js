const httpStatus = require('http-status');
const { Conversation } = require('../models');
const ApiError = require('../utils/ApiError');

const checkConversation = async (req, res, next) => {
  const conversation = await Conversation.findById(req.body.conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'conversation not found');
  }
  res.locals.conversation = conversation;
  next();
};

module.exports = checkConversation;
