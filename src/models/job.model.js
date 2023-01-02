const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const jobSchema = mongoose.Schema(
  {
    posterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    employmentType: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companyLogo: {
      type: Object,
    },
    companyWebsite: {
      type: String,
    },
    tags: {
      type: Array,
    },
    workplaceType: {
      type: String,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    likedBy: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
    viewedBy: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
jobSchema.plugin(toJSON);
jobSchema.plugin(paginate);

/**
 * @typedef Post
 */
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
