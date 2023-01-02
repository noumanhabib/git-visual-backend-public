const httpStatus = require('http-status');

const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { postService, userService } = require('../services');

const createPost = catchAsync(async (req, res) => {
  const postPayload = {
    ...req.body,
    posterId: req.user.id,
    media: req.files.map((file) => {
      return { fileType: file.mimetype, filePath: file.path.replace('public', '') };
    }),
  };
  const post = await postService.createPost(postPayload);
  res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await postService.queryPosts({}, options);
  res.send(result);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.send(post);
});

const likePost = catchAsync(async (req, res) => {
  const filter = { _id: req.user.id, likedPosts: req.params.postId };
  const user = await userService.findByFilter(filter);

  if (user.length) {
    throw new ApiError(httpStatus.CONFLICT, 'Post already liked');
  }

  const update = { $push: { likedBy: req.user.id }, $inc: { likesCount: 1 } };
  const post = await postService.patchPostById(req.params.postId, update);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const userUpdate = { $push: { likedPosts: post.id } };
  await userService.patchUserById(req.user.id, userUpdate);

  res.sendStatus(httpStatus.OK);
});

const viewPost = catchAsync(async (req, res) => {
  const filter = { _id: req.user.id, viewedPosts: req.params.postId };
  const user = await userService.findByFilter(filter);

  if (user.length) {
    throw new ApiError(httpStatus.CONFLICT, 'Post already viewed');
  }

  const update = { $push: { viewedBy: req.user.id }, $inc: { viewsCount: 1 } };
  const post = await postService.patchPostById(req.params.postId, update);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const userUpdate = { $push: { viewedPosts: post.id } };
  await userService.patchUserById(req.user.id, userUpdate);

  res.sendStatus(httpStatus.OK);
});

const updatePost = catchAsync(async (req, res) => {
  const postPayload = {
    ...req.body,
    media: req.files.map((file) => {
      return { fileType: file.mimetype, filePath: file.path.replace('public', '') };
    }),
  };
  const post = await postService.updatePostById(req.params.postId, postPayload);
  res.send(post);
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  viewPost,
};
