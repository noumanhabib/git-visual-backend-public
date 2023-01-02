const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getMessagesForConversation = {
  query: Joi.object().keys({
    conversationId: Joi.custom(objectId).required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const sendMessage = {
  body: Joi.object().keys({
    conversationId: Joi.required().custom(objectId),
    text: Joi.string().min(1).max(500),
    messageType: Joi.string().allow('text', 'media'),
    receiver: Joi.required().custom(objectId),
  }),
};

const readMessages = {
  body: Joi.object().keys({
    conversationId: Joi.custom(objectId).required(),
    messageIds: Joi.array().required(),
  }),
};

const initiateConversation = {
  body: Joi.object().keys({
    receiverId: Joi.required().custom(objectId),
  }),
};

const sendMedia = {
  body: Joi.object().keys({
    conversationId: Joi.custom(objectId).required(),
    uuid: Joi.string().guid().required(),
    receiver: Joi.custom(objectId).required(),
  }),
};

module.exports = {
  sendMessage,
  sendMedia,
  readMessages,
  initiateConversation,
  getMessagesForConversation,
};
