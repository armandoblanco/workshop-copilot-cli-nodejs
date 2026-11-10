# Workshop 1: del issue al merge con agentes en el terminal

**Duración:** 180 minutos. **Formato:** laboratorio individual, siguiendo esta guía.
**Repo de trabajo:** tu fork de [armandoblanco/workshop-copilot-cli-nodejs](https://github.com/armandoblanco/workshop-copilot-cli-nodejs).

## Qué vas a lograr

Al terminar habrás corregido un bug con Fusion, planeado y criticado una funcionalidad con rubber duck, trabajado con varios agentes en paralelo, dividido el cambio en PRs apilados y aplicado una revisión humana antes de mergear.

## Comandos de control del agente

| Comando | Para qué sirve | Dónde lo usas |
| --- | --- | --- |
| `/plan` | Define qué quieres hacer: el agente propone un plan antes de tocar código | M2 |
| `/autopilot` | Copilot trabaja solo hasta que cree que terminó la tarea | M3 |
| `/fleet` | Lanza una flota de agentes que se reparten el trabajo | M3 |
| `/rubber-duck` | Pide a otro modelo que revise el plan o el código | M2 |
| `/allow-all` o `/yolo` | Concede todos los permisos a Copilot, sin pedir aprobación | M0 (solo para conocerlo) |
| `/permissions` | Cambia entre modos de permisos | M0 |
| `/reset-allowed-tools` | Revoca todos los permisos concedidos y empieza de cero | M0 y M3 |

La sintaxis puede variar entre versiones. Si un comando no existe en la tuya, anótalo y sigue (regla 4).

## Agenda

| Min | Módulo | Resultado |
| --- | --- | --- |
| 15 | M0 Arranque | `npm test` corre y Copilot CLI responde |
| 35 | M1 Fusion y modelos | El mismo bug resuelto con Standard y con High, comparados |
| 35 | M2 Plan y rubber duck | Paginación planeada y criticada, con tabla de hallazgos |
| 35 | M3 Paralelizar | Cuatro tareas en paralelo: dos en worktrees y dos delegadas |
| 25 | M4 Stacked PRs | Paginación dividida en tres PRs apilados |
| 20 | M5 Revisión y merge | Checklist de revisión humana aplicado |
| 15 | M6 Costos y cierre | Créditos de IA consumidos por cada enfoque |

## Reglas del laboratorio

1. Trabaja siempre en tu fork, nunca en un repo de la organización.
2. Lee lo que el agente propone antes de aprobar. Aprobar sin leer es la forma más rápida de aprender mal.
3. Anota los créditos de IA que consumes en cada módulo (los usarás en M6).
4. Si un comando falla o no existe en tu versión, no te bloquees: anótalo y sigue. Las funciones nuevas cambian cada semana y una de las metas es que sepas detectar eso.

## M0: arranque (15 min)

1. Verifica tu entorno: `npm run check:setup`. Resuelve lo que marque como FALTA.
2. Instala dependencias: `npm ci`.
3. Corre `npm test`. **Deben fallar exactamente 2 tests**, ambos del filtro `?due=`. Eso es lo esperado.
4. Abre Copilot CLI en la raíz del repo con `copilot` y escribe `Explica la estructura de este repo en cinco líneas`.
5. Revisa los permisos: ejecuta `/permissions` y mira qué modos ofrece. Pide `Corre npm test`, aprueba la herramienta y luego ejecuta `/reset-allowed-tools` para comprobar que vuelve a pedir aprobación.
6. Conoce `/allow-all` (o `/yolo`), pero no lo actives todavía: quita la regla 2 de este laboratorio. Úsalo solo en una copia aislada, nunca con credenciales o repos de la organización.

**Checkpoint:** 8 tests pasan, 2 fallan, Copilot CLI respondió y sabes cómo revocar permisos.

## M1: Fusion y selección de modelo (35 min)

Fusion es un router: eliges un nivel y decide qué modelos usar. Standard equilibra costo y calidad. High agrega orquestación para cambios de varios archivos. Max busca el razonamiento más profundo.

1. Antes de tocar nada, crea una copia aislada del repo con el bug intacto: `git worktree add ../tasks-high -b fusion-high`. Entra a esa carpeta y ejecuta `npm ci`.
2. En el repo principal ejecuta `copilot` y elige Fusion Standard con `/model`.
3. Prompt: `Los tests de ?due= fallan. Encuentra la causa y corrígela sin cambiar los tests.`
4. Revisa el diff, corre `npm test` y haz commit.
5. En `../tasks-high` abre `copilot`, elige Fusion High y usa el mismo prompt. Compara con la tabla de abajo.
6. Repite una tercera vez con Auto y una cuarta con un modelo fijo (por ejemplo Claude Sonnet 5.5), cada una en su propia rama creada desde el commit original.

| Enfoque | Tiempo | Líneas del diff | `npm test` | Créditos de IA |
| --- | --- | --- | --- | --- |
| Fusion Standard | | | | |
| Fusion High | | | | |
| Auto | | | | |
| Modelo fijo | | | | |

**Para pensar:** ¿el modelo más caro dio una solución mejor o solo más grande?

**Límites que debes conocer:** Fusion no inicia subagentes. Descartar un borrador no deshace los archivos que ya se editaron, por eso cada intento usa una rama aislada. Algunos modelos solo están disponibles en ciertos planes; si no ves uno, elige otro y anótalo.

## M2: plan y rubber duck (35 min)

Rubber duck es un agente de revisión que usa un modelo de otra familia que el de tu sesión. Si no hay un modelo adecuado disponible, Copilot no lo invoca. Si cambias de modelo con `/model`, el crítico cambia con él.

1. Ejecuta `/plan Paginación para GET /tasks con limit y cursor.` Lee el plan completo antes de aprobar nada. Si tu versión no tiene `/plan`, usa el prompt `Planifica paginación para GET /tasks con limit y cursor. No implementes todavía.`
2. Pide la segunda opinión de dos formas: `Rubber duck your plan.` y `/rubber-duck What edge cases are missing?`
3. Implementa el plan. Al terminar escribe: `Get a critique of the changes you've made so far.`
4. Llena la tabla. El objetivo es que no aceptes todo sin juicio.
5. Opcional: activa la invocación automática del agente. La sintaxis exacta (`/subagents`) puede variar según tu versión, verifícala.

| Hallazgo del pato | Lo acepté o rechacé | Por qué |
| --- | --- | --- |
| | | |

**Importante:** esta paginación cambia la forma de la respuesta de `GET /tasks`. Los tests existentes pueden fallar. Actualízalos, y entiende por qué, antes de seguir.

**Checkpoint:** `npm test` en verde, con tests nuevos para la paginación, y commit hecho en `main` de tu fork.

## M3: paralelizar con worktrees y delegar a varios agentes (35 min)

Un worktree es otra carpeta con una rama distinta del mismo repositorio. Cada agente trabaja en su copia y no se pisan. Lanzarás cuatro tareas a la vez.

| Opción | Dónde corre | Cuándo conviene |
| --- | --- | --- |
| Worktree local | Tu máquina, una terminal por agente | Quieres ver y corregir en vivo |
| `/delegate` y `&` | Nube, termina en un PR draft | Tarea acotada que no necesita tu atención |

1. Con el código de M2 commiteado en `main`, crea dos worktrees:

```bash
git worktree add ../tasks-validacion -b feat/validacion
git worktree add ../tasks-limites -b feat/limites
```

2. En cada carpeta ejecuta `npm ci` (los `node_modules` no se comparten) y abre `copilot` en una terminal distinta.
3. Terminal 1: `Rechaza títulos vacíos o solo espacios en POST /tasks con 400 y agrega tests.`
4. Terminal 2: `Valida limit en GET /tasks: máximo 100 y error 400 si no es un entero positivo. Agrega tests.`
5. Desde el repo principal delega dos tareas a la nube: `/delegate agrega tests de integración para la paginación` y, en otra sesión, `& documenta la API en el README`. Haz commit antes de delegar para no depender de cómo trata tus cambios sin commitear.
6. Sigue a los agentes en segundo plano con el panel Tasks y usa `/resume` para moverte entre sesiones.
7. Integra el trabajo local: `git merge feat/validacion` y luego `git merge feat/limites`. Las dos tareas tocan el mismo handler a propósito, así que habrá un conflicto. Resuélvelo y corre `npm test`.
8. Revisa los dos PR drafts de la nube como si los hubiera escrito otra persona.
9. Limpieza: `git worktree list` y luego `git worktree remove ../tasks-validacion`, igual con `tasks-limites`.

**Opcional: `/autopilot` y `/fleet`** (si te sobra tiempo)

1. Crea otro worktree: `git worktree add ../tasks-autopilot -b feat/delete`, ejecuta `npm ci` y abre `copilot`.
2. Ejecuta `/autopilot` con `Agrega un endpoint DELETE /tasks/:id con tests.` y deja que trabaje solo. Al terminar revisa el diff completo: que el agente diga que terminó no significa que esté bien. Ejecuta `/reset-allowed-tools` al cerrar.
3. Prueba `/fleet` con una tarea divisible, por ejemplo `Agrega tests faltantes para cada handler de src/routes/tasks.js`. Compara el resultado con lo que lograste con worktrees a mano.
4. Limpieza: `git worktree remove ../tasks-autopilot`.

**Para pensar:**

- ¿Cuánto ahorraste en paralelo frente a lo que tardaste en resolver el conflicto y revisar cuatro resultados?
- ¿Qué tareas no deberían paralelizarse?
- La revisión humana no se paraleliza. Con más agentes, el cuello de botella eres tú.

**Notas:** una misma rama no puede estar abierta en dos worktrees a la vez. Cada agente consume créditos por separado: anótalos. `/autopilot` y `/fleet` pueden consumir muchos créditos en poco tiempo; vigílalos.

## M4: stacked PRs (25 min)

Requiere GitHub CLI 2.90 o superior y la extensión `gh-stack`. Flujo: `gh stack init`, `gh stack add`, `gh stack push`, `gh stack submit` y `gh stack view`.

1. Divide una funcionalidad en tres ramas apiladas: modelo y validación, endpoint, tests y documentación.
2. Envía los tres PRs con `gh stack submit` y mira las relaciones en la web.
3. Mergea el stack completo desde la base cuando pasen los checks requeridos.

Agent Merge excluye los stacked PRs. La documentación de merge y la nota de disponibilidad no coinciden sobre el auto-merge, así que compruébalo en tu fork.

## M5: revisión y merge (20 min)

Pide a Copilot code review en uno de los PRs. Antes de mergear, aplica esta checklist (también está en la plantilla de PR):

- [ ] Leí el diff completo, no solo el resumen del agente.
- [ ] Corrí `npm test` en mi máquina.
- [ ] Revisé si se agregaron dependencias nuevas.
- [ ] Le pregunté al agente qué no probó.
- [ ] Puedo explicar el cambio sin mirar el chat.

## M6: costos y cierre (15 min)

Anota los créditos de IA que consumiste en M1 por enfoque. Conversación final: qué tarea justifica Fusion High o Max y cuál no.

## Si algo sale mal

| Problema | Qué hacer |
| --- | --- |
| `copilot` no existe | `npm install -g @github/copilot` y abre una terminal nueva |
| No ves un modelo | Depende de tu plan o de la política de tu organización. Elige otro |
| `gh stack` no existe | `gh extension install github/gh-stack` y comprueba `gh --version` (2.90 o superior) |
| Quedaste en un estado confuso | `git status`, luego `git stash` o `git reset --hard origin/main` en tu fork. Perderás cambios locales sin commit |
