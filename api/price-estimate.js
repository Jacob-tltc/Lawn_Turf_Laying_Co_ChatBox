import { estimatePrice } from '../pricingEngine.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  try {
    const { area, surfaceType, uneven } = req.body;

    if (!area || !surfaceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = estimatePrice({ area, surfaceType, uneven });

    return res.status(200).json(result);
  } catch (err) {
    console.error('❌ API handler error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}