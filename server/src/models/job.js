const { Schema, model } = require('mongoose');

const JobSchema = new Schema({
  jobId: { type: String, unique: true },
  title: String,
  company: String,
  description: String,
  url: String,
  postedAt: Date,
}, { timestamps: true });

module.exports = model('Job', JobSchema);
