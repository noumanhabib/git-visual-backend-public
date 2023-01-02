const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const messageSchema = mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: {
    type: String,
    trim: true,
    minlength: 1,
  },
  messageType: {
    type: String,
    enum: ['text', 'media'],
    default: 'text',
    required: true,
  },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mediaUrl: {
    type: String,
  },
  read: { type: Boolean, default: false },
});

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
