const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createJob = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    experience: Joi.string().required(),
    employmentType: Joi.string().required(),
    link: Joi.string(),
    companyName: Joi.string(),
    companyLogo: Joi.object(),
    companyWebsite: Joi.string(),
    workplaceType: Joi.string(),
    tags: Joi.array(),
  }),
};

const getJobs = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const searchJobs = {
  body: Joi.object().keys({
    text: Joi.string().required(),
  }),
};

const getJob = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(objectId),
  }),
};

const likeJob = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(objectId),
  }),
};

const viewJob = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(objectId),
  }),
};

const updateJob = {
  params: Joi.object().keys({
    jobId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      experience: Joi.string(),
      employmentType: Joi.string(),
      link: Joi.string(),
      companyName: Joi.string(),
      companyLogo: Joi.object(),
      companyWebsite: Joi.string(),
      workplaceType: Joi.string(),
      tags: Joi.array(),
    })
    .min(1),
};

const deleteJob = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(objectId),
  }),
};

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
