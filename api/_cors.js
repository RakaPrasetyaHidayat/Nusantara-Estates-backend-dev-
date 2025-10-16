// Simple CORS wrapper for Vercel serverless functions
// Echoes the Origin and handles preflight requests
export default function withCors(handler) {
  return async (req, res) => {
    const origin = req.headers?.origin || '*';
    // Allow origin; use echo for flexibility. Adjust to whitelist if needed.
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin'
    );
    // Note: Do NOT set Access-Control-Allow-Credentials unless you restrict origin.
    // If you need credentials, set it to 'true' and replace origin with specific domains.

    if (req.method === 'OPTIONS') {
      // Preflight OK, no body
      res.status(204).end();
      return;
    }

    return handler(req, res);
  };
}