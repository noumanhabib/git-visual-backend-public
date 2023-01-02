const express = require('express');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/storage');
const validate = require('../../middlewares/validate');
const conversationController = require('../../controllers/conversation.controller');
const conversationValidaton = require('../../validations/conversation.validation');
const checkConversation = require('../../middlewares/checkConversation');

const router = express.Router();

router.get('/', auth('getConversations'), conversationController.getUserConversations);

router.post(
  '/init',
  auth('initConversation'),
  validate(conversationValidaton.initiateConversation),
  conversationController.initiateConversation
);

router
  .route('/messages')
  .get(
    auth('getMessages'),
    validate(conversationValidaton.getMessagesForConversation),
    conversationController.getMessagesForConversation
  )
  .post(
    auth('sendMessages'),
    upload.single('media'),
    validate(conversationValidaton.sendMessage),
    checkConversation,
    conversationController.sendMessage
  );

router.post(
  '/messages/read',
  auth('readMessages'),
  validate(conversationValidaton.readMessages),
  checkConversation,
  conversationController.readMessages
);

module.exports = router;
