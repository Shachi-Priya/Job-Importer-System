const axios = require('axios');
const convertXmlToJson = require('../utils/xmlToJson');

const jobFeeds = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm"
];

const cleanXml = xml => xml.replace(/<script[^>]*><\/script>/gi, '');

module.exports = async function fetchJobs() {
  const allJobs = [];

  for (const url of jobFeeds) {
    try {
      const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (JobBot)' } });

      if (res.headers['content-type']?.includes('text/html')) {
        console.warn(`⚠️ Skipping HTML response from ${url}`);
        continue;
      }

      const json = await convertXmlToJson(cleanXml(res.data));
      const root = json.rss || json.RSS;
      const channel = root?.channel?.[0] || root?.CHANNEL?.[0];
      const items = channel?.item;

      if (!Array.isArray(items)) {
        console.warn("⚠️ Unexpected feed structure:", url);
        continue;
      }

      const enriched = items.map(job => ({
        ...job,
        sourceUrl: url // store full URL as-is
      }));

      allJobs.push(...enriched);

    } catch (err) {
      console.error(`Fetch failed for ${url}:`, err.message);
    }
  }

  console.log(`Fetched jobs: ${allJobs.length}`);
  return allJobs;
};
