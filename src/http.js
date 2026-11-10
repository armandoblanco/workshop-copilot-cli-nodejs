// Utilidades HTTP mínimas para no depender de un framework.

const MAX_BODY_BYTES = 100 * 1024;

export function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

// Lee y parsea el cuerpo JSON. Si es inválido responde 400 y devuelve undefined.
export async function readJson(req, res) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      sendJson(res, 413, { error: 'Cuerpo demasiado grande' });
      return undefined;
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};

  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      sendJson(res, 400, { error: 'El cuerpo debe ser un objeto JSON' });
      return undefined;
    }
    return parsed;
  } catch {
    sendJson(res, 400, { error: 'JSON inválido' });
    return undefined;
  }
}
