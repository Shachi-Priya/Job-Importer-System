require('dotenv').config();
const connectDB = require('./src/config/db');
const queue = require('./src/jobs/jobQueue');
const cron = require('node-cron');

connectDB().then(() => {
  console.log("Cron connected DB");

  queue.add('job-import', {}).then(() => console.log("First import queued"));

  cron.schedule('0 * * * *', () => {
    console.log("Cron scheduled import");
    queue.add('job-import', {});
  });
});
