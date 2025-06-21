const Job = require('../models/job');
const ImportLog = require('../models/importLog');

module.exports = async function processJobData(jobs) {
  let newJobs = 0, updatedJobs = 0, failedJobs = [];

  for (const job of jobs) {
    try {
      const id = job.guid?.[0]?._ || job.link?.[0];
      if (!id) throw new Error("Missing jobId");

      const data = {
        jobId: id,
        title: job.title?.[0] || '',
        url: job.link?.[0] || '',
        description: job.description?.[0] || '',
        postedAt: job.pubDate?.[0] ? new Date(job.pubDate[0]) : new Date()
      };

      const existing = await Job.findOne({ jobId: id });
      if (existing) {
        await Job.updateOne({ jobId: id }, data);
        updatedJobs++;
      } else {
        await Job.create(data);
        newJobs++;
      }

    } catch (e) {
      failedJobs.push({ reason: e.message });
    }
  }
console.log("jobs[0]?.sourceUrl::", jobs[0]?.sourceUrl)
  await ImportLog.create({
    fileName: jobs[0]?.sourceUrl || 'Unknown Feed',
    timestamp: new Date(),
    totalFetched: jobs.length,
    newJobs,
    updatedJobs,
    failedJobs,
  });
};
