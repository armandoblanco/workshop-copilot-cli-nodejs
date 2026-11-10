// Almacén en memoria. Se reinicia cada vez que arranca el servidor.
// Cada llamada a createStore() devuelve un almacén independiente, útil para los tests.

export function createStore(initial = []) {
  const tasks = new Map();
  let nextId = 1;

  for (const task of initial) {
    const id = nextId++;
    tasks.set(id, { id, status: 'open', due: null, ...task });
  }

  return {
    all() {
      return [...tasks.values()];
    },
    get(id) {
      return tasks.get(id) ?? null;
    },
    create({ title, due }) {
      const id = nextId++;
      const task = { id, title, status: 'open', due };
      tasks.set(id, task);
      return task;
    },
    update(id, changes) {
      const current = tasks.get(id);
      if (!current) return null;
      const updated = { ...current, ...changes, id };
      tasks.set(id, updated);
      return updated;
    },
    remove(id) {
      return tasks.delete(id);
    },
  };
}

// Datos de ejemplo para el servidor en modo desarrollo.
export const seedTasks = [
  { title: 'Revisar tickets abiertos del turno de la mañana', due: '2026-11-12T09:00:00-05:00' },
  { title: 'Enviar reporte semanal a Contoso Seguros', due: '2026-11-13T17:00:00-06:00' },
  { title: 'Actualizar la guía de escalamiento', due: null },
];
