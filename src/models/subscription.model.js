const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const subscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'premium', 'enterprise'],
      required: true,
    },
    credits: {
      type: Number,
      enum: [1, 5, 10],
      required: true,
    },
    expireAt: {},
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
subscriptionSchema.plugin(toJSON);

// expires documents in 60 days
subscriptionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 * 24 * 60 });

const Subscription = mongoose.model('subscription', subscriptionSchema);

module.exports = Subscription;
