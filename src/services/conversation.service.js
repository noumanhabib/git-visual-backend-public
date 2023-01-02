const httpStatus = require('http-status');
const { Message, Conversation } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessage = async (messageBody) => {
  return Message.create(messageBody);
};

const createConversation = async (conversationBody) => {
  const { members } = conversationBody;

  const conversation = await Conversation.find({ members: { $in: members } });
  console.log(conversation);
  if (conversation === undefined || conversation === null) {
    throw new ApiError(httpStatus.CONFLICT, 'Conversation already exists');
  }
  return Conversation.create(conversationBody);
};

/**
 * Query for messages
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMessagesByConversationId = async (filter, options) => {
  const messages = await Message.paginate(filter, options);
  return messages;
};

const getConversationsByUserId = async (userId) => {
  return Conversation.find({ members: userId }).populate({
    path: 'members',
  });
};
/**
 * Get message by userId
 * @param {string} userId
 * @returns {Promise<Message>}
 */
const getMessagesByConversationId = async (conversationId) => {
  return Message.find({ conversationId });
};

/**
 * Update conversation by id
 * @param {ObjectId} messageId
 * @param {Object} updateBody
 * @returns {Promise<Message>}
 */
const updateConversationById = async (conversationId, updateBody) => {
  return Conversation.findByIdAndUpdate(conversationId, updateBody, { useFindAndModify: true });
};

const readMessages = async (messageIds) => {
  return Message.updateMany(
    {
      _id: { $in: messageIds },
    },
    { $set: { read: true } }
  );
};

module.exports = {
  createMessage,
  createConversation,
  queryMessagesByConversationId,
  getMessagesByConversationId,
  updateConversationById,
  getConversationsByUserId,
  readMessages,
};
