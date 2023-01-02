const httpStatus = require('http-status');
const { Job } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a job
 * @param {Object} jobBody
 * @returns {Promise<Job>}
 */
const createJob = async (jobBody) => {
  return Job.create(jobBody);
};

/**
 * Query for jobs
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryJobs = async (filter, options) => {
  const jobs = await Job.paginate(filter, options);
  return jobs;
};

/**
 * Get job by id
 * @param {ObjectId} id
 * @returns {Promise<Job>}
 */
const getJobById = async (id) => {
  return Job.findById(id);
};

/**
 * Get job by userId
 * @param {string} userId
 * @returns {Promise<Job>}
 */
const getJobsByUserId = async (userId) => {
  return Job.find({ userId });
};

const seachJobsByString = async (text) => {
  const regex = new RegExp(`${text}`);
  return Job.find({
    $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
  });
};

/**
 * Update job by id
 * @param {ObjectId} jobId
 * @param {Object} updateBody
 * @returns {Promise<Job>}
 */
const updateJobById = async (jobId, updateBody) => {
  const job = await getJobById(jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  Object.assign(job, updateBody);
  await job.save();
  return job;
};

const patchJobById = async (jobId, patch) => {
  return Job.findByIdAndUpdate(jobId, patch);
};

/**
 * Delete job by id
 * @param {ObjectId} jobId
 * @returns {Promise<Job>}
 */
const deleteJobById = async (jobId) => {
  const job = await getJobById(jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  await job.remove();
  return job;
};

module.exports = {
  createJob,
  queryJobs,
  getJobById,
  getJobsByUserId,
  updateJobById,
  deleteJobById,
  patchJobById,
  seachJobsByString,
};
