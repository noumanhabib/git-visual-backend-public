const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCheckoutSession = {
  body: Joi.object().keys({
    packageType: Joi.string().required(),
    successUrl: Joi.string().required(),
    cancelUrl: Joi.string().required(),
  }),
};

const setupSubscription = {
  query: Joi.object().keys({
    sessionId: Joi.string().required(),
  }),
};

const getUserSubscription = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  createCheckoutSession,
  setupSubscription,
  getUserSubscription,
};
