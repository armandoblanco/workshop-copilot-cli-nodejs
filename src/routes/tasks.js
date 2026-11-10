import orderBy from 'lodash/orderBy.js';
import { readJson, sendJson } from '../http.js';

// Maneja /tasks y /tasks/:id. Devuelve true si atendió la petición.
export async function handleTasks(req, res, url, store) {
  const match = url.pathname.match(/^\/tasks(?:\/(\d+))?$/);
  if (!match) return false;

  const id = match[1] ? Number(match[1]) : null;

  if (id === null) {
    if (req.method === 'GET') return listTasks(res, url, store);
    if (req.method === 'POST') return createTask(req, res, store);
    sendJson(res, 405, { error: 'Método no permitido' });
    return true;
  }

  const task = store.get(id);
  if (!task) {
    sendJson(res, 404, { error: 'Tarea no encontrada' });
    return true;
  }

  if (req.method === 'GET') {
    sendJson(res, 200, task);
  } else if (req.method === 'PATCH') {
    const body = await readJson(req, res);
    if (body === undefined) return true;
    const status = body.status === 'done' ? 'done' : 'open';
    sendJson(res, 200, store.update(id, { status }));
  } else if (req.method === 'DELETE') {
    store.remove(id);
    res.writeHead(204).end();
  } else {
    sendJson(res, 405, { error: 'Método no permitido' });
  }
  return true;
}

function listTasks(res, url, store) {
  let tasks = store.all();

  // ?due=<fecha ISO 8601>: tareas que vencen en ese instante o antes.
  const due = url.searchParams.get('due');
  if (due) {
    tasks = tasks.filter((t) => t.due !== null && t.due <= due);
  }

  const status = url.searchParams.get('status');
  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }

  // Las tareas sin fecha van al final.
  tasks = orderBy(tasks, [(t) => (t.due ? Date.parse(t.due) : Infinity), 'id']);

  sendJson(res, 200, tasks);
  return true;
}

async function createTask(req, res, store) {
  const body = await readJson(req, res);
  if (body === undefined) return true;

  const { title = '', due = null } = body;
  const task = store.create({ title, due });
  sendJson(res, 201, task);
  return true;
}
