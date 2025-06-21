const { Queue } = require('bullmq');
const redis = require('../config/redis');

const jobQueue = new Queue('job-import', {
  connection: redis.options
});

module.exports = jobQueue;
