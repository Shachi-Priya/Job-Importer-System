// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${process.env.NODE_URL}/api/import/logs`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching logs:", error.message);
    res.status(500).json({ error: "Failed to fetch import logs." });
  }
}