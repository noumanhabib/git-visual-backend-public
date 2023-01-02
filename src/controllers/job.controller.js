const httpStatus = require('http-status');

const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { jobService, userService } = require('../services');

const createJob = catchAsync(async (req, res) => {
  const companyLogo = req.file;
  if (companyLogo) {
    const jobPayload = {
      ...req.body,
      posterId: req.user.id,
      companyLogo: { fileType: companyLogo.mimetype, filePath: companyLogo.path.replace('public', '') },
    };
    const job = await jobService.createJob(jobPayload);
    res.status(httpStatus.CREATED).send(job);
    return;
  }
  const job = await jobService.createJob({ ...req.body, posterId: req.user.id });
  res.status(httpStatus.CREATED).send(job);
});

const getJobs = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await jobService.queryJobs({}, options);
  res.send(result);
});

const getJob = catchAsync(async (req, res) => {
  const job = await jobService.getJobById(req.params.jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  res.send(job);
});

const searchJobs = catchAsync(async (req, res) => {
  const jobs = await jobService.seachJobsByString(req.body.text);
  res.send(jobs);
});

const likeJob = catchAsync(async (req, res) => {
  const filter = { _id: req.user.id, likedJobs: req.params.jobId };
  const user = await userService.findByFilter(filter);

  if (user.length) {
    throw new ApiError(httpStatus.CONFLICT, 'Job already liked');
  }

  const update = { $push: { likedBy: req.user.id }, $inc: { likesCount: 1 } };
  const job = await jobService.patchJobById(req.params.jobId, update);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  const userUpdate = { $push: { likedJobs: job.id } };
  await userService.patchUserById(req.user.id, userUpdate);

  res.sendStatus(httpStatus.OK);
});

const viewJob = catchAsync(async (req, res) => {
  const filter = { _id: req.user.id, viewedJobs: req.params.jobId };
  const user = await userService.findByFilter(filter);

  if (user.length) {
    throw new ApiError(httpStatus.CONFLICT, 'Job already viewed');
  }

  const update = { $push: { viewedBy: req.user.id }, $inc: { viewsCount: 1 } };
  const job = await jobService.patchJobById(req.params.jobId, update);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  const userUpdate = { $push: { viewedJobs: job.id } };
  await userService.patchUserById(req.user.id, userUpdate);

  res.sendStatus(httpStatus.OK);
});

const updateJob = catchAsync(async (req, res) => {
  const companyLogo = req.file;
  if (companyLogo) {
    const jobPayload = {
      ...req.body,
      companyLogo: { fileType: companyLogo.mimetype, filePath: companyLogo.path.replace('public', '') },
    };
    const job = await jobService.updateJobById(req.params.jobId, jobPayload);
    res.send(job);
    return;
  }
  const job = await jobService.updateJobById(req.params.jobId, req.body);
  res.send(job);
});

const deleteJob = catchAsync(async (req, res) => {
  await jobService.deleteJobById(req.params.jobId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  likeJob,
  viewJob,
  searchJobs,
};
