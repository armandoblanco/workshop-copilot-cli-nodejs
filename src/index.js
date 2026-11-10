import { createApp } from './app.js';
import { createStore, seedTasks } from './store.js';

const port = Number(process.env.PORT) || 3000;
const app = createApp(createStore(seedTasks));

app.listen(port, () => {
  console.log(`Contoso Tasks API escuchando en http://localhost:${port}`);
});
