/**
 * Vercel serverless — exports a subset of Braze user profile by external_id (REST).
 * Env: BRAZE_REST_API_KEY (required), BRAZE_REST_URL (default https://rest.iad-03.braze.com).
 */
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.BRAZE_REST_API_KEY;
  const restUrl = (process.env.BRAZE_REST_URL || 'https://rest.iad-03.braze.com').replace(/\/$/, '');

  if (!apiKey) {
    res.status(500).json({ error: 'BRAZE_REST_API_KEY is not configured' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }
  }

  const external_id = typeof body?.external_id === 'string' ? body.external_id.trim() : '';
  if (!external_id) {
    res.status(400).json({ error: 'external_id is required' });
    return;
  }

  try {
    const brazeRes = await fetch(`${restUrl}/users/export/ids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        external_ids: [external_id],
        fields_to_export: ['custom_attributes', 'first_name', 'last_name', 'email'],
      }),
    });

    const text = await brazeRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      res.status(502).json({ error: 'Invalid response from Braze' });
      return;
    }

    if (!brazeRes.ok) {
      res.status(brazeRes.status).json({
        error: data.message || 'Braze API error',
        detail: typeof data === 'object' ? data : text.slice(0, 200),
      });
      return;
    }

    const user = Array.isArray(data.users) ? data.users[0] : null;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const custom = user.custom_attributes && typeof user.custom_attributes === 'object'
      ? user.custom_attributes
      : {};

    res.status(200).json({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      pphg_loyalty_id: custom.pphg_loyalty_id ?? null,
      pphg_loyalty_points: custom.pphg_loyalty_points ?? null,
      pphg_loyalty_tier: custom.pphg_loyalty_tier ?? null,
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};
