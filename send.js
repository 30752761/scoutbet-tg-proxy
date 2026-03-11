export default async function handler(req, res) {
  // CORS — liberar qualquer origem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Aceitar GET ou POST
  let token, chat_id, text;
  if (req.method === 'GET') {
    token   = req.query.token;
    chat_id = req.query.chat_id;
    text    = req.query.text;
  } else {
    token   = req.body?.token;
    chat_id = req.body?.chat_id;
    text    = req.body?.text;
  }

  if (!token || !chat_id || !text) {
    return res.status(400).json({ error: 'token, chat_id e text sao obrigatorios' });
  }

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text, parse_mode: 'Markdown' })
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
