const express = require('express');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/storage');
const parseStringToArray = require('../../middlewares/parseStringToArray');
const validate = require('../../middlewares/validate');

const postValidation = require('../../validations/post.validation');
const postController = require('../../controllers/post.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('managePosts'),
    upload.array('media'),
    parseStringToArray(['tags', 'tools']),
    validate(postValidation.createPost),
    postController.createPost
  )
  .get(validate(postValidation.getPosts), postController.getPosts);

router.get('/like/:postId', auth('likePosts'), validate(postValidation.likePost), postController.likePost);

router.get('/view/:postId', auth('viewPosts'), validate(postValidation.viewPost), postController.viewPost);

router
  .route('/:postId')
  .get(auth('getPosts'), validate(postValidation.getPost), postController.getPost)
  .patch(
    auth('managePosts'),
    upload.array('media'),
    parseStringToArray(['tags', 'tools']),
    validate(postValidation.updatePost),
    postController.updatePost
  )
  .delete(auth('managePosts'), validate(postValidation.deletePost), postController.deletePost);

module.exports = router;
