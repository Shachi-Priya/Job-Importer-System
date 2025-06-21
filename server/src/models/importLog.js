const { Schema, model } = require('mongoose');

const ImportLogSchema = new Schema({
  fileName: String,
  timestamp: Date,
  totalFetched: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [{ reason: String }],
}, { timestamps: true });

module.exports = model('ImportLog', ImportLogSchema);
