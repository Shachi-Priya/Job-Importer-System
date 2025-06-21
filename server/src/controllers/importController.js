const ImportLog = require('../models/importLog');

const getLogs = async (req, res) => {
  const logs = await ImportLog.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
};

module.exports = { getLogs };