const express = require('express');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const subscriptiontValidation = require('../../validations/subscription.validation');
const subscriptionController = require('../../controllers/subscription.controller');

const router = express.Router();

router.post(
  '/pay',
  auth('pay'),
  validate(subscriptiontValidation.createCheckoutSession),
  subscriptionController.createCheckoutSession
);

router.get(
  '/subscribe',
  auth('subscribe'),
  validate(subscriptiontValidation.setupSubscription),
  subscriptionController.setupSubscription
);

router.get(
  '/user/:userId',
  auth('getSubscription'),
  validate(subscriptiontValidation.getUserSubscription),
  subscriptionController.getUserSubscription
);

module.exports = router;
