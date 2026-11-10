import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { createStore } from '../src/store.js';

let server;
let base;

before(async () => {
  server = createApp(createStore());
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

async function api(path, options = {}) {
  const res = await fetch(base + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

describe('salud', () => {
  test('GET /health responde ok', async () => {
    const { status, body } = await api('/health');
    assert.equal(status, 200);
    assert.deepEqual(body, { status: 'ok' });
  });
});

describe('CRUD de tareas', () => {
  test('POST /tasks crea una tarea abierta', async () => {
    const { status, body } = await api('/tasks', {
      method: 'POST',
      body: { title: 'Preparar demo' },
    });
    assert.equal(status, 201);
    assert.equal(body.title, 'Preparar demo');
    assert.equal(body.status, 'open');
    assert.equal(typeof body.id, 'number');
  });

  test('GET /tasks/:id devuelve la tarea creada', async () => {
    const created = await api('/tasks', { method: 'POST', body: { title: 'Leer incidente' } });
    const { status, body } = await api(`/tasks/${created.body.id}`);
    assert.equal(status, 200);
    assert.equal(body.title, 'Leer incidente');
  });

  test('GET /tasks/:id responde 404 si no existe', async () => {
    const { status } = await api('/tasks/99999');
    assert.equal(status, 404);
  });

  test('PATCH /tasks/:id marca la tarea como hecha', async () => {
    const created = await api('/tasks', { method: 'POST', body: { title: 'Cerrar ticket' } });
    const { status, body } = await api(`/tasks/${created.body.id}`, {
      method: 'PATCH',
      body: { status: 'done' },
    });
    assert.equal(status, 200);
    assert.equal(body.status, 'done');
  });

  test('DELETE /tasks/:id elimina la tarea', async () => {
    const created = await api('/tasks', { method: 'POST', body: { title: 'Borrar' } });
    const deleted = await api(`/tasks/${created.body.id}`, { method: 'DELETE' });
    assert.equal(deleted.status, 204);
    const after = await api(`/tasks/${created.body.id}`);
    assert.equal(after.status, 404);
  });

  test('POST /tasks con JSON inválido responde 400', async () => {
    const res = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{no es json',
    });
    assert.equal(res.status, 400);
  });
});

describe('filtro ?due=', () => {
  // Estas tareas usan distintos desfases horarios a propósito.
  // 2026-11-10T23:30:00-05:00 equivale a 2026-11-11T04:30:00Z
  // 2026-11-11T01:00:00+02:00 equivale a 2026-11-10T23:00:00Z
  before(async () => {
    await api('/tasks', {
      method: 'POST',
      body: { title: 'due-ny', due: '2026-11-10T23:30:00-05:00' },
    });
    await api('/tasks', {
      method: 'POST',
      body: { title: 'due-berlin', due: '2026-11-11T01:00:00+02:00' },
    });
    await api('/tasks', {
      method: 'POST',
      body: { title: 'due-utc', due: '2026-11-09T12:00:00Z' },
    });
  });

  const titles = (list) => list.map((t) => t.title);

  test('incluye una tarea que vence antes, con el mismo desfase', async () => {
    const { body } = await api('/tasks?due=2026-11-10T00:00:00Z');
    assert.ok(titles(body).includes('due-utc'));
  });

  test('excluye una tarea que vence después en UTC aunque su texto sea menor', async () => {
    // due-ny vence 2026-11-11T04:30Z, después del corte 2026-11-11T00:00Z.
    const { body } = await api('/tasks?due=2026-11-11T00:00:00Z');
    assert.ok(!titles(body).includes('due-ny'));
  });

  test('incluye una tarea que vence antes en UTC aunque su texto sea mayor', async () => {
    // due-berlin vence 2026-11-10T23:00Z, antes del corte 2026-11-11T00:00Z.
    const { body } = await api('/tasks?due=2026-11-11T00:00:00Z');
    assert.ok(titles(body).includes('due-berlin'));
  });
});
