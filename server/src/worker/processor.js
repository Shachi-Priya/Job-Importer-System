const { Worker } = require('bullmq');
const redis = require('../config/redis');
const fetchJobs = require('../services/jobFetcher');
const processJobData = require('../services/jobProcessor');
const connectDB = require('../config/db');

// Ensure MongoDB is connected before processing
connectDB().then(() => {
  console.log("MongoDB connected in worker");
}).catch(err => {
  console.error("MongoDB connection error in worker:", err.message);
});

const worker = new Worker('job-import', async job => {
  const jobs = await fetchJobs();
  await processJobData(jobs);
}, {
  connection: redis.options,
});

worker.on('completed', job => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.log(`Job ${job?.id} failed: ${err.message}`));
