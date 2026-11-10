# 🖥 Workshop 1: Del issue al merge con agentes en la terminal

## GitHub Copilot CLI con Node.js · Contoso Servicios

**Duración:** 3 horas · **Nivel:** intermedio · **Formato:** laboratorio individual guiado

---

## 📋 Tabla de contenidos

- [Introducción](#-introducción)
- [Conceptos clave](#-conceptos-clave)
- [Pre-requisitos](#-pre-requisitos)
- [Agenda](#-agenda)
- [Reglas del laboratorio](#-reglas-del-laboratorio)
- [Ejercicio 0: Arranque](#-ejercicio-0-arranque-15-min)
- [Ejercicio 1: Fusion y selección de modelo](#-ejercicio-1-fusion-y-selección-de-modelo-35-min)
- [Ejercicio 2: Planear y criticar con rubber duck](#-ejercicio-2-planear-y-criticar-con-rubber-duck-35-min)
- [Ejercicio 3: Agentes en paralelo](#-ejercicio-3-agentes-en-paralelo-35-min)
- [Ejercicio 4: Stacked PRs](#-ejercicio-4-stacked-prs-25-min)
- [Ejercicio 5: Revisión humana y merge](#-ejercicio-5-revisión-humana-y-merge-20-min)
- [Ejercicio 6: Costos y cierre](#-ejercicio-6-costos-y-cierre-15-min)
- [¿Te quedaste atrás?](#-te-quedaste-atrás)
- [Checklist final](#-checklist-final)
- [Referencia rápida](#-referencia-rápida)

---

## 🎯 Introducción

En este laboratorio llevas un cambio real desde el issue hasta el merge usando **Copilot CLI**, el agente de Copilot que trabaja en la terminal. Partes de la API de tareas de Contoso Servicios, que tiene un bug conocido y le faltan funciones.

Al terminar habrás:

- ✅ Corregido el mismo bug con cuatro modelos distintos y comparado costo contra calidad
- ✅ Planeado una funcionalidad y pedido una crítica a otro modelo con rubber duck
- ✅ Lanzado varias tareas en paralelo con agentes locales y, opcionalmente, en la nube
- ✅ Dividido una funcionalidad en tres ramas apiladas
- ✅ Revisado código generado por agentes con una checklist humana antes de mergear

---

## 🧠 Conceptos clave

### Copilot CLI

Copilot CLI es un agente que corre en tu terminal. Lee el repositorio, propone cambios, edita archivos y ejecuta comandos. Antes de usar una herramienta (por ejemplo, ejecutar `npm test` o escribir un archivo) te pide permiso, salvo que ya se lo hayas concedido.

```bash
copilot          # abre una sesión interactiva en la carpeta actual
```

Dentro de la sesión escribes en lenguaje natural o usas comandos que empiezan con `/`.

### Copilot Fusion y selección de modelo

Fusion es un **router**: eliges un nivel y Fusion decide qué modelos usar.

| Opción | Cuándo conviene |
| --- | --- |
| Fusion Standard | Equilibrio entre costo y calidad. Buen punto de partida |
| Fusion High | Cambios que tocan varios archivos y requieren orquestación |
| Fusion Max | Problemas que piden el razonamiento más profundo |
| Auto | Copilot elige el modelo por ti |
| Modelo fijo | Quieres controlar exactamente qué modelo responde |

Se cambia con `/model` dentro de la sesión.

### Rubber duck

Rubber duck es un agente de revisión que usa un modelo **de otra familia** que el de tu sesión. Sirve para pedir una segunda opinión sobre un plan o sobre código. Si no hay un modelo adecuado disponible, Copilot no lo invoca.

### Worktrees

Un worktree es **otra carpeta con otra rama del mismo repositorio**. Te permite tener varias copias de trabajo a la vez, una por agente, sin que se pisen.

```bash
git worktree add ../otra-carpeta -b otra-rama   # crea la copia
git worktree list                                # lista las copias
git worktree remove ../otra-carpeta              # la elimina
```

### Trabajo local frente a trabajo en la nube

| Opción | Dónde corre | Resultado | Cuándo conviene |
| --- | --- | --- | --- |
| Agente en un worktree | Tu máquina, una terminal por agente | Commits en una rama local | Quieres ver y corregir en vivo |
| `/delegate` o `&` | La nube de GitHub | Un PR en borrador | Tarea acotada que no necesita tu atención |

### Comandos de control del agente

| Comando | Para qué sirve | Dónde lo usas |
| --- | --- | --- |
| `/plan` | Define qué quieres hacer: el agente propone un plan antes de tocar código | Ejercicio 2 |
| `/autopilot` | Copilot trabaja solo hasta que cree que terminó la tarea | Ejercicio 3 (bonus) |
| `/fleet` | Lanza una flota de agentes que se reparten el trabajo | Ejercicio 3 (bonus) |
| `/rubber-duck` | Pide a otro modelo que revise el plan o el código | Ejercicio 2 |
| `/allow-all` o `/yolo` | Concede todos los permisos a Copilot, sin pedir aprobación | Ejercicio 0 (solo para conocerlo) |
| `/permissions` | Cambia entre modos de permisos | Ejercicio 0 |
| `/reset-allowed-tools` | Revoca todos los permisos concedidos y empieza de cero | Ejercicios 0 y 3 |
| `/model` | Cambia el modelo de la sesión | Ejercicio 1 |
| `/delegate` | Envía una tarea a un agente en la nube | Ejercicio 3 |
| `/resume` | Retoma una sesión anterior | Ejercicio 3 |

> ⚠ **Nota importante:** la sintaxis de estos comandos puede variar entre versiones. Si un comando no existe en la tuya, revisa `/help`, anótalo y sigue.

---

## 🧰 Pre-requisitos

Completa la sección [Cómo empezar](../README.md#-cómo-empezar) del README antes de este laboratorio. En resumen:

- Repositorio clonado en tu máquina (no necesitas un fork).
- `npm run check:setup` sin elementos en `FALTA`.
- Node.js 22+, Git 2.20+, GitHub CLI 2.90+, Copilot CLI y la extensión `gh-stack`.

---

## 📅 Agenda

| Horario | Ejercicio | Resultado |
| --- | --- | --- |
| 0:00 - 0:15 | Ejercicio 0: Arranque | Tests corriendo y Copilot CLI respondiendo |
| 0:15 - 0:50 | Ejercicio 1: Fusion y modelos | El mismo bug resuelto con cuatro enfoques, comparados |
| 0:50 - 1:25 | Ejercicio 2: Plan y rubber duck | Paginación planeada, criticada e implementada |
| 1:25 - 1:35 | ☕ Descanso | |
| 1:35 - 2:10 | Ejercicio 3: Agentes en paralelo | Cuatro tareas en paralelo integradas en `main` |
| 2:10 - 2:35 | Ejercicio 4: Stacked PRs | Una funcionalidad dividida en tres ramas apiladas |
| 2:35 - 2:50 | Ejercicio 5: Revisión y merge | Checklist de revisión humana aplicada |
| 2:50 - 3:00 | Ejercicio 6: Costos y cierre | Costo de cada enfoque comparado |

> ⏱ Los tiempos son aproximados. Los pasos marcados como **bonus** son opcionales.

---

## 📏 Reglas del laboratorio

1. **Trabaja en tu copia local.** Los pasos marcados con 🌐 necesitan un repositorio propio en GitHub y son opcionales (ver el [Paso 2 del README](../README.md#paso-2-repositorio-propio-en-github--opcional)).
2. **Lee lo que el agente propone antes de aprobar.** Aprobar sin leer es la forma más rápida de aprender mal.
3. **Anota los créditos de IA** que consumes en cada ejercicio. Los usarás en el Ejercicio 6.
4. **Si un comando falla o no existe en tu versión, no te bloquees:** anótalo y sigue. Las funciones nuevas cambian cada semana y una de las metas es que sepas detectarlo.

---

## 🔬 Ejercicio 0: Arranque (15 min)

### Objetivos

- ✅ Confirmar que tu entorno está listo
- ✅ Ver el punto de partida: 2 tests fallando
- ✅ Abrir tu primera sesión de Copilot CLI
- ✅ Entender cómo se conceden y revocan permisos

### Paso 0.1: Verificar el entorno

En la raíz del repositorio ejecuta:

```bash
npm run check:setup
```

✅ **Verificar:** todas las líneas dicen `OK`. Si alguna dice `FALTA`, sigue la instrucción que aparece debajo.

### Paso 0.2: Instalar dependencias y correr los tests

```bash
npm ci
npm test
```

✅ **Verificar:**

- 8 tests pasan.
- 2 tests fallan, ambos con `filtro ?due=` en el nombre.

> 📝 Esos 2 tests rojos son el bug que corregirás en el Ejercicio 1. No los toques todavía.

### Paso 0.3: Abrir Copilot CLI

```bash
copilot
```

🤖 **PROMPT — escribe en Copilot CLI:**

```text
Explica la estructura de este repo en cinco líneas.
```

📝 **Observa:** Copilot lee los archivos del proyecto para responder. Puede pedirte permiso para leer carpetas o ejecutar comandos.

### Paso 0.4: Conceder y revocar permisos

1. Escribe `/permissions` y revisa qué modos ofrece tu versión.
2. Pide a Copilot que ejecute los tests:

   ```text
   Corre npm test y resume el resultado.
   ```

3. Cuando te pida permiso para ejecutar el comando, apruébalo.
4. Escribe `/reset-allowed-tools`.
5. Repite el prompt del punto 2.

✅ **Verificar:** después de `/reset-allowed-tools`, Copilot vuelve a pedirte permiso.

### Paso 0.5: Conocer `/allow-all` (sin activarlo)

`/allow-all` (o `/yolo`) concede **todos** los permisos de una vez: el agente ya no te pregunta antes de ejecutar comandos o editar archivos.

> ⚠ **No lo actives en este laboratorio.** Rompe la regla 2. Úsalo solo en una copia aislada del código, nunca con credenciales a la vista ni en repositorios de tu organización.

### ✅ Checkpoint del Ejercicio 0

- [ ] 8 tests pasan y 2 fallan.
- [ ] Copilot CLI respondió a tu primer prompt.
- [ ] Sabes revocar permisos con `/reset-allowed-tools`.

### 🧯 Troubleshooting Ejercicio 0

| Problema | Solución |
| --- | --- |
| `copilot: command not found` | `npm install -g @github/copilot` y abre una terminal nueva |
| Copilot dice que no tienes acceso | Si tu licencia es de una organización, pide que habiliten la política de Copilot CLI |
| `npm ci` falla | Comprueba que usas Node.js 22 o superior con `node -v` |
| Fallan más de 2 tests | Revisa la versión de Node.js y que no hayas modificado archivos |

---

## 🔬 Ejercicio 1: Fusion y selección de modelo (35 min)

### Objetivos

- ✅ Resolver el mismo bug con cuatro enfoques distintos
- ✅ Medir tiempo, tamaño del cambio y costo de cada uno
- ✅ Decidir con datos cuándo vale la pena un modelo más caro

> 💡 **La idea:** para comparar de forma justa, cada intento parte del **mismo código con el bug intacto**. Por eso cada enfoque trabaja en su propia carpeta (worktree).

### Paso 1.1: Preparar tres copias con el bug intacto

Desde la raíz del repositorio, **antes de cambiar nada**:

```bash
git worktree add ../tasks-high  -b fusion-high
git worktree add ../tasks-auto  -b fusion-auto
git worktree add ../tasks-fijo  -b modelo-fijo
```

Instala dependencias en cada copia (los `node_modules` no se comparten):

```bash
(cd ../tasks-high && npm ci)
(cd ../tasks-auto && npm ci)
(cd ../tasks-fijo && npm ci)
```

✅ **Verificar:** `git worktree list` muestra cuatro carpetas: la original y las tres nuevas.

### Paso 1.2: Intento 1 con Fusion Standard

1. En la carpeta original, abre `copilot`.
2. Escribe `/model` y elige **Fusion Standard**.
3. Anota la hora de inicio.

🤖 **PROMPT — escribe en Copilot CLI:**

```text
Los tests de ?due= fallan. Encuentra la causa y corrígela sin cambiar los tests.
```

4. Lee el diff que propone antes de aprobarlo.
5. Cuando termine, sal de Copilot y comprueba:

   ```bash
   npm test
   git diff --stat
   ```

6. Si los tests pasan, haz commit:

   ```bash
   git commit -am "Corrige el filtro ?due="
   ```

7. Anota en la tabla del Paso 1.5 el tiempo, las líneas del diff y los créditos consumidos.

📝 **Observa:** ¿Copilot explicó por qué fallaba el filtro antes de corregirlo? ¿Tocó solo lo necesario?

### Paso 1.3: Intento 2 con Fusion High

```bash
cd ../tasks-high
copilot
```

1. Escribe `/model` y elige **Fusion High**.
2. Usa **exactamente el mismo prompt** del Paso 1.2.
3. Revisa el diff, corre `npm test` y anota los resultados.

### Paso 1.4: Intentos 3 y 4 con Auto y con un modelo fijo

Repite el Paso 1.3 dos veces más:

| Carpeta | Modelo que eliges con `/model` |
| --- | --- |
| `../tasks-auto` | **Auto** |
| `../tasks-fijo` | Un modelo fijo, por ejemplo Claude Sonnet 5.5 |

> 📝 Algunos modelos solo están disponibles en ciertos planes. Si no ves uno, elige otro y anota cuál usaste.

### Paso 1.5: Comparar los resultados

| Enfoque | Tiempo | Líneas del diff | `npm test` | Créditos de IA |
| --- | --- | --- | --- | --- |
| Fusion Standard | | | | |
| Fusion High | | | | |
| Auto | | | | |
| Modelo fijo | | | | |

**🤔 Para pensar:** ¿el modelo más caro dio una solución mejor o solo más grande?

### Paso 1.6: Limpiar

Vuelve a la carpeta original y elimina las copias:

```bash
cd ../workshop-copilot-cli-nodejs
git worktree remove ../tasks-high
git worktree remove ../tasks-auto
git worktree remove ../tasks-fijo
```

> ⚠ **Límites que debes conocer:**
>
> - Fusion no inicia subagentes.
> - Descartar un borrador no deshace los archivos que ya se editaron. Por eso cada intento usa su propia carpeta.

### ✅ Checkpoint del Ejercicio 1

- [ ] `npm test` en verde en la carpeta original, con el commit de Fusion Standard.
- [ ] Tabla comparativa con los cuatro enfoques.

### 🧯 Troubleshooting Ejercicio 1

| Problema | Solución |
| --- | --- |
| `fatal: '../tasks-high' already exists` | Ya existe la carpeta. Elimínala con `git worktree remove ../tasks-high` o usa otro nombre |
| No veo Fusion en `/model` | Depende de tu plan o de la política de tu organización. Elige otro modelo y anótalo |
| Copilot cambió los tests | Recházalo y repite el prompt insistiendo en "sin cambiar los tests" |
| No sé cuántos créditos consumí | Revisa el resumen de uso de tu sesión o la página de facturación de Copilot |

---

## 🔬 Ejercicio 2: Planear y criticar con rubber duck (35 min)

### Objetivos

- ✅ Pedir un plan antes de escribir código
- ✅ Obtener una segunda opinión de otro modelo
- ✅ Decidir qué críticas aceptar y cuáles no
- ✅ Implementar paginación en `GET /tasks`

> 💡 **La idea:** el plan es más barato de corregir que el código. Rubber duck revisa el plan con un modelo de otra familia, así que ve cosas que el primero pasó por alto. Si cambias de modelo con `/model`, el crítico cambia con él.

### Paso 2.1: Pedir el plan

En la carpeta original abre `copilot`.

🤖 **PROMPT — escribe en Copilot CLI:**

```text
/plan Paginación para GET /tasks con limit y cursor.
```

📝 **Alternativa** si tu versión no tiene `/plan`:

```text
Planifica paginación para GET /tasks con limit y cursor. No implementes todavía.
```

Lee el plan completo. **No apruebes nada todavía.**

### Paso 2.2: Pedir la segunda opinión

Pide la crítica de dos formas y compara las respuestas:

🤖 **PROMPT 1:**

```text
Rubber duck your plan.
```

🤖 **PROMPT 2:**

```text
/rubber-duck What edge cases are missing?
```

📝 **Observa:** ¿el pato encontró casos que el plan no cubría? Por ejemplo: `limit` en cero, un cursor inválido, una tarea eliminada entre dos páginas.

### Paso 2.3: Implementar el plan

Pide a Copilot que implemente el plan con las mejoras que te parezcan válidas.

> ⚠ **Importante:** la paginación cambia la forma de la respuesta de `GET /tasks`. Algunos tests existentes van a fallar. Actualízalos y **entiende por qué** fallaban antes de seguir.

### Paso 2.4: Criticar el código

Cuando la implementación termine:

🤖 **PROMPT — escribe en Copilot CLI:**

```text
Get a critique of the changes you've made so far.
```

### Paso 2.5: Registrar tus decisiones

Llena esta tabla con al menos tres hallazgos del pato. El objetivo es que **no aceptes todo sin juicio**.

| Hallazgo del pato | Lo acepté o lo rechacé | Por qué |
| --- | --- | --- |
| | | |
| | | |
| | | |

### Paso 2.6: Verificar y hacer commit

```bash
npm test
git add -A
git commit -m "Agrega paginación a GET /tasks"
```

### Paso 2.7: Invocación automática del pato (⭐ bonus)

Copilot puede invocar al crítico solo, sin que se lo pidas. La sintaxis exacta (`/subagents`) puede variar según tu versión. Búscala con `/help` y pruébala.

### ✅ Checkpoint del Ejercicio 2

- [ ] `npm test` en verde, con tests nuevos para la paginación.
- [ ] Tabla de hallazgos con tus decisiones.
- [ ] Commit hecho en `main`.

### 🧯 Troubleshooting Ejercicio 2

| Problema | Solución |
| --- | --- |
| Rubber duck no responde | No hay un modelo de otra familia disponible. Cambia de modelo con `/model` y vuelve a intentarlo |
| Copilot empezó a implementar en el Paso 2.1 | Interrúmpelo, descarta los cambios con `git checkout .` y repite insistiendo en "no implementes todavía" |
| Los tests antiguos fallan | Es esperado: la respuesta ahora tiene otra forma. Actualiza los tests, no la paginación |

---

## 🔬 Ejercicio 3: Agentes en paralelo (35 min)

### Objetivos

- ✅ Trabajar con dos agentes locales a la vez, cada uno en su worktree
- ✅ Delegar dos tareas a agentes en la nube (🌐 opcional)
- ✅ Integrar el trabajo y resolver un conflicto
- ✅ Medir si el paralelismo realmente ahorró tiempo

> 💡 **La idea:** lanzarás varias tareas a la vez. Dos corren en tu máquina, donde puedes verlas y corregirlas. Si tienes un repositorio propio en GitHub, puedes delegar dos más a la nube, que terminan en un PR en borrador.

### Paso 3.1: Crear dos worktrees

Con el código del Ejercicio 2 ya commiteado en `main`:

```bash
git worktree add ../tasks-validacion -b feat/validacion
git worktree add ../tasks-limites -b feat/limites
(cd ../tasks-validacion && npm ci)
(cd ../tasks-limites && npm ci)
```

### Paso 3.2: Lanzar los dos agentes locales

Abre **dos terminales nuevas** y en cada una entra a la raíz del repositorio.

**Terminal 1:**

```bash
cd ../tasks-validacion
copilot
```

🤖 **PROMPT:**

```text
Rechaza títulos vacíos o solo espacios en POST /tasks con 400 y agrega tests.
```

**Terminal 2:**

```bash
cd ../tasks-limites
copilot
```

🤖 **PROMPT:**

```text
Valida limit en GET /tasks: máximo 100 y error 400 si no es un entero positivo. Agrega tests.
```

Deja que ambos trabajen. Aprueba los permisos que pidan después de leerlos.

### Paso 3.3: Delegar dos tareas a la nube (🌐 opcional)

> 📝 Si trabajas solo en local, salta al [Paso 3.5](#paso-35-integrar-el-trabajo-local).

Los agentes en la nube trabajan sobre lo que está en GitHub, así que primero sube tu código a tu repositorio propio:

```bash
git push origin main
```

En la carpeta original abre `copilot` y delega la primera tarea:

```text
/delegate agrega tests de integración para la paginación
```

Abre otra sesión de `copilot` y delega la segunda con el atajo `&`:

```text
& documenta la API en el README
```

✅ **Verificar:** cada delegación responde con un enlace a un PR en borrador en tu repositorio.

### Paso 3.4: Seguir el trabajo en segundo plano (🌐 opcional)

- Usa el panel **Tasks** para ver el avance de los agentes.
- Usa `/resume` para moverte entre sesiones.

### Paso 3.5: Integrar el trabajo local

Cuando los dos agentes locales terminen, haz commit en cada worktree:

```bash
(cd ../tasks-validacion && git add -A && git commit -m "Valida títulos en POST /tasks")
(cd ../tasks-limites && git add -A && git commit -m "Valida limit en GET /tasks")
```

En la carpeta original, mezcla las dos ramas:

```bash
git merge feat/validacion
git merge feat/limites
```

> 📝 **Habrá un conflicto, y es a propósito:** las dos tareas tocan el mismo handler. Resuélvelo a mano o pide ayuda a Copilot, y luego:
>
> ```bash
> npm test
> git add -A
> git commit -m "Integra validaciones"
> ```

### Paso 3.6: Revisar los PRs de la nube (🌐 opcional)

Abre los dos PRs en borrador en tu repositorio. Revísalos **como si los hubiera escrito otra persona**: lee el diff completo, no solo la descripción.

### Paso 3.7: Limpiar

```bash
git worktree list
git worktree remove ../tasks-validacion
git worktree remove ../tasks-limites
```

### Paso 3.8: Trabajar en autopiloto (⭐ bonus)

1. Crea otra copia:

   ```bash
   git worktree add ../tasks-autopilot -b feat/editar-tarea
   cd ../tasks-autopilot && npm ci && copilot
   ```

2. Escribe `/autopilot` y luego:

   ```text
   Permite editar title y due en PATCH /tasks/:id, con validación y tests.
   ```

3. Deja que trabaje solo hasta que diga que terminó.
4. Revisa el diff completo. **Que el agente diga que terminó no significa que esté bien.**
5. Ejecuta `/reset-allowed-tools` antes de cerrar la sesión.

### Paso 3.9: Lanzar una flota de agentes (⭐ bonus)

En la misma copia prueba `/fleet` con una tarea que se pueda dividir:

```text
/fleet Agrega los tests que faltan para cada handler de src/routes/tasks.js.
```

Compara el resultado con lo que lograste con worktrees a mano. Al terminar:

```bash
cd ../workshop-copilot-cli-nodejs
git worktree remove ../tasks-autopilot
```

> ⚠ `/autopilot` y `/fleet` pueden consumir muchos créditos en poco tiempo. Vigílalos y anótalos.

### 🤔 Para pensar

- ¿Cuánto ahorraste en paralelo frente a lo que tardaste en resolver el conflicto y revisar cuatro resultados?
- ¿Qué tareas no deberían paralelizarse?
- La revisión humana no se paraleliza. Con más agentes, el cuello de botella eres tú.

### ✅ Checkpoint del Ejercicio 3

- [ ] Las dos validaciones están en `main` y `npm test` pasa.
- [ ] (🌐 opcional) Dos PRs en borrador creados por agentes en la nube y revisados.
- [ ] Worktrees eliminados.

### 🧯 Troubleshooting Ejercicio 3

| Problema | Solución |
| --- | --- |
| `fatal: 'feat/validacion' is already checked out` | Una rama no puede estar abierta en dos worktrees a la vez. Usa otro nombre de rama |
| `/delegate` no crea el PR | Comprueba que creaste tu repositorio propio, que hiciste `git push` y que tiene Actions habilitado |
| No encuentro el panel Tasks | Depende de tu versión. Usa `/resume` para listar las sesiones |
| El merge deja el código roto | Pide a Copilot: "Resuelve el conflicto conservando las dos validaciones y corre npm test" |

---

## 🔬 Ejercicio 4: Stacked PRs (25 min)

### Objetivos

- ✅ Dividir una funcionalidad en tres ramas pequeñas que dependen una de la otra
- ✅ Ver el stack completo en local
- ✅ Publicarlo como tres PRs con `gh stack` (🌐 opcional)

> 💡 **La idea:** un cambio grande es difícil de revisar. Un stack son varias ramas pequeñas apiladas: cada una parte de la anterior y se revisa por separado. Al publicarlo, cada rama se convierte en un PR.

```text
main
 └── feat/prioridad-modelo     PR 1: campo priority y validación
      └── feat/prioridad-filtro    PR 2: filtro ?priority=
           └── feat/prioridad-tests    PR 3: tests y documentación
```

> 📝 Requiere GitHub CLI 2.90 o superior y la extensión `gh-stack`. Los argumentos exactos pueden variar: revisa `gh stack --help` si algo no coincide.

### Paso 4.1: Preparar el punto de partida

```bash
git checkout main
git status
gh stack --help
```

✅ **Verificar:** estás en `main` y no hay cambios sin commit.

### Paso 4.2: Iniciar el stack

```bash
gh stack init
```

### Paso 4.3: Capa 1, el modelo

```bash
gh stack add feat/prioridad-modelo
copilot
```

🤖 **PROMPT:**

```text
Agrega un campo priority a las tareas (low, normal o high; por defecto normal). Valida el valor en POST /tasks y responde 400 si no es válido. No agregues filtros todavía.
```

Revisa, corre `npm test` y haz commit:

```bash
git add -A && git commit -m "Agrega el campo priority"
```

### Paso 4.4: Capa 2, el filtro

```bash
gh stack add feat/prioridad-filtro
copilot
```

🤖 **PROMPT:**

```text
Agrega el filtro ?priority= a GET /tasks. Debe convivir con los filtros y la paginación que ya existen.
```

```bash
git add -A && git commit -m "Agrega el filtro ?priority="
```

### Paso 4.5: Capa 3, tests y documentación

```bash
gh stack add feat/prioridad-tests
copilot
```

🤖 **PROMPT:**

```text
Agrega tests para el campo priority y el filtro ?priority=, y documenta ambos en el README.
```

```bash
git add -A && git commit -m "Tests y documentación de priority"
```

### Paso 4.6: Ver el stack en local

```bash
git log --oneline --graph --all
```

✅ **Verificar:** ves las tres ramas en línea, cada una con un commit encima de la anterior.

### Paso 4.7: Publicar el stack (🌐 opcional)

Si tienes un repositorio propio en GitHub:

```bash
gh stack push
gh stack submit
gh stack view
```

✅ **Verificar:** en tu repositorio hay tres PRs y cada uno apunta a la rama de la capa anterior.

> ⚠ Agent Merge excluye los stacked PRs. La documentación de merge y la nota de disponibilidad no coinciden sobre el auto-merge, así que compruébalo en tu repositorio.

### ✅ Checkpoint del Ejercicio 4

- [ ] Tres ramas apiladas, cada una con solo su capa.
- [ ] (🌐 opcional) Tres PRs apilados en tu repositorio.

### 🧯 Troubleshooting Ejercicio 4

| Problema | Solución |
| --- | --- |
| `gh stack` no existe | `gh extension install github/gh-stack` y comprueba `gh --version` (2.90 o superior) |
| `gh stack add` no acepta el nombre de rama | Revisa la sintaxis con `gh stack add --help` |
| Una rama incluye cambios de otra capa | Hiciste commit en la rama equivocada. Revisa con `git log --oneline --graph --all` |

---

## 🔬 Ejercicio 5: Revisión humana y merge (20 min)

### Objetivos

- ✅ Pedir una revisión de código a Copilot
- ✅ Aplicar una checklist humana antes de mezclar
- ✅ Mezclar el stack en `main`

### Paso 5.1: Pedir la revisión de Copilot

En la carpeta original abre `copilot`.

🤖 **PROMPT:**

```text
Actúa como revisor de código. Revisa el diff entre main y feat/prioridad-tests y lista los hallazgos ordenados por severidad: validaciones faltantes, códigos HTTP incorrectos y tests ausentes. No modifiques archivos.
```

> 🌐 **Opcional:** si publicaste el stack, abre uno de los PRs en GitHub y en **Reviewers** selecciona **Copilot**.

### Paso 5.2: Preguntar qué no se probó

En la carpeta original abre `copilot`:

🤖 **PROMPT:**

```text
Revisa los cambios de la rama feat/prioridad-filtro. ¿Qué casos no están cubiertos por los tests?
```

### Paso 5.3: Aplicar la checklist humana

Esta checklist también está en la [plantilla de PR](../.github/PULL_REQUEST_TEMPLATE.md). Repásala antes de mezclar:

- [ ] Leí el diff completo, no solo el resumen del agente.
- [ ] Corrí `npm test` en mi máquina.
- [ ] Revisé si se agregaron dependencias nuevas.
- [ ] Le pregunté al agente qué no probó.
- [ ] Puedo explicar el cambio sin mirar el chat.

### Paso 5.4: Mezclar en `main`

Si todo está marcado, mezcla la última capa del stack. Incluye las tres:

```bash
git checkout main
git merge feat/prioridad-tests
npm test
```

Si falta algo, corrígelo en la capa que corresponda antes de mezclar.

> 🌐 **Opcional:** si publicaste el stack, mergea desde GitHub empezando por la base (el PR de la capa 1).

### ✅ Checkpoint del Ejercicio 5

- [ ] Stack revisado por Copilot y por ti, con la checklist completa.
- [ ] `priority` mezclado en `main` y `npm test` en verde.

---

## 🔬 Ejercicio 6: Costos y cierre (15 min)

### Objetivos

- ✅ Comparar el costo de cada enfoque
- ✅ Decidir cuándo se justifica un modelo más caro

### Paso 6.1: Reunir los números

Completa con lo que anotaste durante el laboratorio:

| Ejercicio | Enfoque | Créditos de IA |
| --- | --- | --- |
| 1 | Fusion Standard | |
| 1 | Fusion High | |
| 1 | Auto | |
| 1 | Modelo fijo | |
| 2 | Plan + rubber duck | |
| 3 | Dos agentes locales | |
| 3 | Dos agentes en la nube (🌐) | |
| 3 | `/autopilot` y `/fleet` (bonus) | |

### Paso 6.2: Conversación final

- ¿Qué tarea de hoy justificaba Fusion High o Max? ¿Cuál no?
- ¿Cuántos créditos costó el paralelismo frente al tiempo que ahorró?
- ¿Qué cambiarías en tu forma de trabajar el lunes?

---

## 🆘 ¿Te quedaste atrás?

No te preocupes: el valor está en experimentar con los agentes, no en terminar todo.

| Situación | Qué hacer |
| --- | --- |
| No terminé el Ejercicio 1 | Pide al instructor la corrección del filtro `?due=` y sigue con el Ejercicio 2 |
| No terminé la paginación | Los Ejercicios 3 y 4 funcionan igual sin ella. Omite el prompt de `limit` del Paso 3.2 |
| `/delegate` no funciona en mi cuenta | Haz solo la parte local del Ejercicio 3 |
| Quedé en un estado confuso | `git status` y luego `git stash` o `git reset --hard upstream/main` para volver al punto de partida del taller. **Perderás todos tus cambios locales** |
| Mi resultado es distinto al de mi vecino | Es normal: los agentes no son deterministas. Comparen resultados |

---

## ✅ Checklist final

Al terminar deberías tener en tu copia local:

### Código

- [ ] Filtro `?due=` corregido y sus tests en verde
- [ ] Paginación con `limit` y `cursor` en `GET /tasks`
- [ ] Validación de títulos en `POST /tasks`
- [ ] Validación de `limit` en `GET /tasks`
- [ ] Campo `priority` y filtro `?priority=`

### Ramas y revisión

- [ ] Tres ramas apiladas con `gh stack`, mezcladas en `main`
- [ ] Checklist de revisión humana aplicada antes de mezclar
- [ ] (🌐 opcional) Dos PRs de agentes en la nube y tres PRs apilados en GitHub

### Aprendizaje

- [ ] Tabla comparativa de modelos del Ejercicio 1
- [ ] Tabla de hallazgos del pato del Ejercicio 2
- [ ] Tabla de costos del Ejercicio 6

---

## 📖 Referencia rápida

### Comandos de Copilot CLI

| Comando | Qué hace |
| --- | --- |
| `copilot` | Abre una sesión en la carpeta actual |
| `/model` | Cambia el modelo |
| `/plan` | Pide un plan antes de implementar |
| `/rubber-duck` | Pide una crítica a otro modelo |
| `/autopilot` | Trabaja solo hasta terminar |
| `/fleet` | Reparte el trabajo entre varios agentes |
| `/delegate` o `&` | Envía la tarea a un agente en la nube |
| `/resume` | Retoma una sesión anterior |
| `/permissions` | Cambia el modo de permisos |
| `/allow-all` o `/yolo` | Concede todos los permisos |
| `/reset-allowed-tools` | Revoca los permisos concedidos |
| `/help` | Lista los comandos de tu versión |

### Comandos de Git y GitHub CLI

| Comando | Qué hace |
| --- | --- |
| `git worktree add ../carpeta -b rama` | Crea una copia de trabajo con una rama nueva |
| `git worktree list` | Lista las copias |
| `git worktree remove ../carpeta` | Elimina una copia |
| `gh stack init` / `add` / `push` / `submit` / `view` | Crea y publica un stack de PRs |

### Tips para mejores resultados

| Tip | Ejemplo |
| --- | --- |
| Di qué no debe tocar | "Corrígelo sin cambiar los tests" |
| Pide el plan antes del código | "Planifica... No implementes todavía" |
| Pide una segunda opinión | "Rubber duck your plan" |
| Pregunta qué no probó | "¿Qué casos no están cubiertos?" |
| Una tarea por agente | Un worktree por tarea, nunca dos agentes en la misma carpeta |

---

➡ **Siguiente:** [Workshop 2: Automatización agéntica con gobierno](workshop-2.md)
