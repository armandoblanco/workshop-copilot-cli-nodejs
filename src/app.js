import { createServer } from 'node:http';
import { sendJson } from './http.js';
import { handleTasks } from './routes/tasks.js';

export function createApp(store) {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');

      if (url.pathname === '/health' && req.method === 'GET') {
        sendJson(res, 200, { status: 'ok' });
        return;
      }

      if (await handleTasks(req, res, url, store)) return;

      sendJson(res, 404, { error: 'Ruta no encontrada' });
    } catch (error) {
      console.error(error);
      sendJson(res, 500, { error: 'Error interno' });
    }
  });
}
