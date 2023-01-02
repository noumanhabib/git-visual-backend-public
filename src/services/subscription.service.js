const stripe = require('stripe');

const httpStatus = require('http-status');
const config = require('../config/config');
const { User, Subscription } = require('../models');
const ApiError = require('../utils/ApiError');

const Stripe = stripe(config.stripeKey);

const priceIds = {
  ...(config.env === 'production'
    ? { starter: 'price_1MBymEBq5byX0xad4A1KdbOb' }
    : { starter: 'price_1MByybBq5byX0xadjGrzxAv6' }),

  ...(config.env === 'production'
    ? { premium: 'price_1MBymWBq5byX0xad7rFSeGgh' }
    : { premium: 'price_1MByzCBq5byX0xada0kBdBFF' }),

  ...(config.env === 'production'
    ? { enterprise: 'price_1MBymrBq5byX0xad9qCwFEWD' }
    : { enterprise: 'price_1MByzXBq5byX0xadKz9rsUOs' }),
};

const credits = {
  starter: 1,
  premium: 5,
  enterprise: 10,
};

const createCheckoutSession = async (packageType, successUrl, cancelUrl, customerId, userId) => {
  const subscription = await Subscription.findOne({ user: userId });
  if (subscription) {
    throw new ApiError(httpStatus.CONFLICT, 'User already subscribed');
  }
  const session = await Stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceIds[packageType],
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: {
      packageType,
    },
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${cancelUrl}?canceled=true`,
  });

  return session;
};

const createCustomer = async (user) => {
  if (user.customerId) {
    return user.customerId;
  }
  const customer = await Stripe.customers.create({
    email: user.email,
    metadata: {
      userId: user.id,
    },
  });
  console.log(customer.id);
  await User.findByIdAndUpdate(user.id, { customerId: customer.id });
  return customer.id;
};

const setupSubscription = async (sessionId) => {
  console.log(sessionId);
  const session = await Stripe.checkout.sessions.retrieve(sessionId);

  const customer = await Stripe.customers.retrieve(session.customer);
  let subscription = await Subscription.findOne({ user: customer.metadata.userId });
  if (subscription) {
    throw new ApiError(httpStatus.CONFLICT, 'User already subscribed');
  }
  subscription = await Subscription.create({
    user: customer.metadata.userId,
    subscription: session.metadata.packageType,
    credits: credits[session.metadata.packageType],
  });
  return subscription;
};

const getSubscritionByUserId = async (userId) => {
  return Subscription.findOne({ user: userId });
};

module.exports = {
  createCheckoutSession,
  createCustomer,
  setupSubscription,
  getSubscritionByUserId,
};
