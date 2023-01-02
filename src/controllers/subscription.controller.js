const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const { subscriptionService } = require('../services');
const ApiError = require('../utils/ApiError');

const createCheckoutSession = catchAsync(async (req, res) => {
  const { packageType, successUrl, cancelUrl } = req.body;
  const customerId = await subscriptionService.createCustomer(req.user);

  const session = await subscriptionService.createCheckoutSession(
    packageType,
    successUrl,
    cancelUrl,
    customerId,
    req.user.id
  );
  if (!session) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Payment failed');
  }
  res.json({ url: session.url });
});

const setupSubscription = catchAsync(async (req, res) => {
  console.log(req.query.sessionId)
  const subscription = await subscriptionService.setupSubscription(req.query.sessionId);
  console.log(subscription);

  res.send(subscription);
});

const getUserSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.getSubscritionByUserId(req.params.userId);
  res.send(subscription);
});

module.exports = {
  createCheckoutSession,
  setupSubscription,
  getUserSubscription,
};
