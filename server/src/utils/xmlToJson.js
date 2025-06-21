const xml2js = require('xml2js');

const parser = new xml2js.Parser({
  // explicitArray: true,
  // strict: false,
  // trim: true,
});

const convertXmlToJson = async (xml) => {
  return await parser.parseStringPromise(xml);
};

module.exports = convertXmlToJson;
