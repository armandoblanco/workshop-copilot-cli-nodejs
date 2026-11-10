# ⚙ Workshop 2: Automatización agéntica con gobierno

## GitHub Copilot CLI con Node.js · Contoso Servicios

**Duración:** 3 horas · **Nivel:** intermedio · **Formato:** laboratorio individual guiado

---

## 📋 Tabla de contenidos

- [Introducción](#-introducción)
- [Conceptos clave](#-conceptos-clave)
- [Pre-requisitos](#-pre-requisitos)
- [Agenda](#-agenda)
- [Ejercicio 0: Arranque](#-ejercicio-0-arranque-10-min)
- [Ejercicio 1: Agentic Workflows](#-ejercicio-1-agentic-workflows-45-min)
- [Ejercicio 2: Skills y plugins](#-ejercicio-2-skills-y-plugins-35-min)
- [Ejercicio 3: Agentes propios y hooks](#-ejercicio-3-agentes-propios-y-hooks-35-min)
- [Ejercicio 4: El SDK de Copilot en Node.js](#-ejercicio-4-el-sdk-de-copilot-en-nodejs-30-min)
- [Ejercicio 5: Gobierno y costos](#-ejercicio-5-gobierno-y-costos-25-min)
- [¿Te quedaste atrás?](#-te-quedaste-atrás)
- [Checklist final](#-checklist-final)
- [Referencia rápida](#-referencia-rápida)

---

## 🎯 Introducción

En el Workshop 1 usaste agentes de forma interactiva. Aquí los conviertes en **automatizaciones**: agentes que se disparan solos, que siguen reglas del equipo y que tienen límites claros.

Al terminar habrás:

- ✅ Escrito un workflow agéntico en Markdown que hace triage de issues
- ✅ Instalado una skill de terceros fijando su versión, y creado una propia
- ✅ Creado un agente revisor y hooks que corren tests y bloquean comandos peligrosos
- ✅ Escrito un script en Node.js que usa Copilot con una herramienta propia
- ✅ Redactado una política de una página sobre qué pueden hacer los agentes de tu equipo

> ⚠ **Nota importante:** varias piezas de este workshop están en preview o cambian rápido. Cuando un comando no coincida con tu versión, consulta la documentación oficial, anota la diferencia y sigue.

---

## 🧠 Conceptos clave

### Las piezas de este workshop

| Pieza | Dónde vive | Qué es | Cuándo usarla |
| --- | --- | --- | --- |
| Agentic Workflow | `.github/workflows/*.md` | Un workflow de Actions escrito en Markdown que ejecuta un agente | Tareas que se disparan solas: triage, análisis de fallas |
| Skill | `.github/skills/*/SKILL.md` | Instrucciones empaquetadas que Copilot carga cuando son relevantes | Conocimiento del equipo que se repite |
| Plugin | Un repositorio | Un paquete que agrupa skills, hooks y agentes para instalarlos juntos | Compartir varias piezas entre repos |
| Agente propio | `.github/agents/*.agent.md` | Copilot con un rol, herramientas y reglas fijas | Necesitas un especialista, por ejemplo un revisor |
| Hook | `.github/hooks/*.json` | Un comando que se ejecuta siempre en un punto del flujo del agente | Reglas que no deben depender del modelo |
| SDK | Tu código Node.js | Una librería para controlar Copilot desde un programa | Integrar Copilot en tus propias herramientas |

### Determinista frente a agéntico

| | Workflow determinista (`.yml`) | Agentic Workflow (`.md`) |
| --- | --- | --- |
| Quién decide los pasos | Tú, paso por paso | El agente, a partir de tus instrucciones |
| Mismo resultado cada vez | Sí | No necesariamente |
| Ideal para | Compilar, probar, publicar | Clasificar, resumir, analizar |

> 💡 Los workflows agénticos **complementan** a los deterministas, no los reemplazan.

---

## 🧰 Pre-requisitos

- Workshop 1 terminado, o el repositorio clonado con `npm test` en verde.
- Extensión `gh-aw` instalada.
- GitHub CLI 2.90 o superior (lo necesita `gh skill`).
- (🌐 opcional) Un repositorio propio en GitHub con Actions habilitado, solo para los pasos marcados con 🌐. Consulta el [Paso 2 del README](../README.md#paso-2-repositorio-propio-en-github--opcional).

---

## 📅 Agenda

| Horario | Ejercicio | Resultado |
| --- | --- | --- |
| 0:00 - 0:10 | Ejercicio 0: Arranque | Extensiones listas |
| 0:10 - 0:55 | Ejercicio 1: Agentic Workflows | Un workflow de triage escrito y validado en local |
| 0:55 - 1:05 | ☕ Descanso | |
| 1:05 - 1:40 | Ejercicio 2: Skills y plugins | Una skill fijada por versión y una propia |
| 1:40 - 2:15 | Ejercicio 3: Agentes y hooks | Un agente revisor y hooks que corren tests y bloquean comandos |
| 2:15 - 2:45 | Ejercicio 4: SDK en Node.js | Un script que usa Copilot con una herramienta propia |
| 2:45 - 3:00 | Ejercicio 5: Gobierno y costos | Política de una página para agentes del equipo |

---

## 🔬 Ejercicio 0: Arranque (10 min)

### Objetivos

- ✅ Confirmar que tienes `gh-aw`
- ✅ (🌐 opcional) Preparar tu repositorio propio con Actions e issues de práctica

### Paso 0.1: Verificar el entorno

```bash
npm run check:setup
```

✅ **Verificar:** la línea `Extensión gh-aw` dice `OK`. Si dice `FALTA`:

```bash
gh extension install github/gh-aw
```

### Paso 0.2: Habilitar Actions (🌐 opcional)

> 📝 Si trabajas solo en local, salta al [Ejercicio 1](#-ejercicio-1-agentic-workflows-45-min).

1. Abre tu repositorio propio en GitHub.
2. Ve a **Settings → Actions → General**.
3. Selecciona **Allow all actions and reusable workflows** y guarda.

### Paso 0.3: Crear los issues de práctica (🌐 opcional)

Reemplaza `TU-USUARIO/TU-REPO` por tu repositorio propio:

```bash
./scripts/seed-issues.sh TU-USUARIO/TU-REPO
```

El script pide confirmación antes de crear nada.

✅ **Verificar:** la pestaña **Issues** de tu repositorio tiene 4 issues nuevos: un bug, una pregunta, una petición de funcionalidad y uno vago ("No funciona").

---

## 🔬 Ejercicio 1: Agentic Workflows (45 min)

### Objetivos

- ✅ Escribir un workflow agéntico en Markdown
- ✅ Validarlo en tu máquina
- ✅ (🌐 opcional) Probarlo en un repositorio temporal y desplegarlo en GitHub
- ✅ (🌐 opcional) Crear un segundo workflow que analice fallas de CI

> 💡 **Cómo funcionan:** un Agentic Workflow es un archivo Markdown con un encabezado YAML. `gh aw compile` lo valida y genera un `.lock.yml` que Actions ejecuta. El agente corre con permisos de **solo lectura** y solo puede escribir mediante **salidas seguras** (`safe-outputs`) que tú apruebas de antemano. El motor por defecto es Copilot CLI y requiere licencia.

### Parte A: Escribir y validar en local

> 📝 El agente de un Agentic Workflow siempre corre en GitHub Actions, no en tu máquina. En local puedes escribir el workflow y validarlo. Ejecutarlo requiere GitHub (🌐).

### Paso 1.1: Escribir el workflow

Crea una carpeta de trabajo fuera del repositorio:

```bash
mkdir -p ~/aw-lab && cd ~/aw-lab
```

Crea el archivo `triage-demo.md` **escribiéndolo tú**, siguiendo el [quickstart oficial de gh-aw](https://github.github.com/gh-aw/). Escribirlo es parte del aprendizaje.

Tu workflow debe cumplir estos requisitos:

| Requisito | Qué significa |
| --- | --- |
| Se activa al abrirse un issue | El disparador es la apertura de un issue |
| Permisos de solo lectura | El agente no puede modificar el repositorio |
| Motor `copilot` | Usa Copilot CLI como agente |
| Un solo comentario mediante `safe-outputs` | Lo único que puede escribir es un comentario |
| Instrucciones en Markdown | Clasifica el issue (bug, pregunta, funcionalidad o incompleto) y explica por qué |

> 💡 **Tip:** si te atoras, puedes pedir ayuda a Copilot CLI para **entender** un campo del encabezado: "¿Qué hace safe-outputs en un Agentic Workflow?". Evita pedirle el archivo completo.

### Paso 1.2: Validar en tu máquina

```bash
gh aw compile --validate --strict
```

Esto no ejecuta el agente ni crea nada en GitHub.

✅ **Verificar:** el comando termina sin errores. Si rechaza el encabezado, corrígelo y repite.

### Paso 1.3: Vista previa sin ejecutar

```bash
gh aw trial ./triage-demo.md --dry-run
```

> ⚠ Usa la ruta con `./`. Sin ella, el CLI puede interpretar el nombre como un repositorio.

### Paso 1.4: Ejecución real en un repositorio temporal (🌐 opcional)

El CLI crea un repositorio temporal en tu cuenta de GitHub, ejecuta el workflow y lo borra al terminar. No sube tu código.

```bash
gh aw trial ./triage-demo.md --delete-host-repo-after
```

Para un workflow disparado por issues, pasa un issue real como contexto, por ejemplo uno de tu repositorio propio:

```bash
gh aw trial ./triage-demo.md --delete-host-repo-after --trigger-context https://github.com/TU-USUARIO/TU-REPO/issues/1
```

> ⚠ **Límites de la ejecución temporal:**
>
> - El agente corre en GitHub Actions del repositorio temporal, no en tu máquina, y consume créditos de IA.
> - Los secretos de tus repositorios no se heredan. El repositorio temporal necesita su propio `COPILOT_GITHUB_TOKEN`.
> - Borrar el repositorio temporal requiere el permiso `delete_repo` en tu token de `gh` (`gh auth refresh -s delete_repo`).

### Parte B: Integrar en el repositorio

### Paso 1.5: Copiar y compilar

Vuelve al repositorio del taller y copia el workflow:

```bash
cd ~/ruta/a/workshop-copilot-cli-nodejs
mkdir -p .github/workflows
cp ~/aw-lab/triage-demo.md .github/workflows/
gh aw compile
```

✅ **Verificar:** existen `.github/workflows/triage-demo.md` y su `.lock.yml`.

Haz commit en local:

```bash
git add .github/workflows/
git commit -m "Agrega workflow agéntico de triage"
```

> 📝 Haz commit del `.md` **y** del `.lock.yml`. Actions ejecuta el `.lock.yml`.

### Parte C: Verlo trabajar en GitHub (🌐 opcional)

> 📝 Si trabajas solo en local, salta al [Ejercicio 2](#-ejercicio-2-skills-y-plugins-35-min).

### Paso 1.6: Publicar en tu repositorio propio

```bash
git push
```

### Paso 1.7: Verlo trabajar

1. Abre un issue nuevo en tu repositorio, por ejemplo: "La API devuelve 500 al crear una tarea sin título".
2. Ve a la pestaña **Actions** y observa la ejecución.
3. Vuelve al issue.

✅ **Verificar:** el agente dejó **un solo comentario** con la clasificación. No cambió etiquetas, no cerró el issue y no tocó código: `safe-outputs` solo le permite comentar.

### Paso 1.8: Segundo workflow, análisis de fallas de CI (🌐 opcional)

Crea un segundo workflow que se active cuando falle el CI y comente un análisis de la causa.

Para probarlo, rompe un test a propósito en una rama:

```bash
git checkout -b prueba/ci-roto
# Cambia un valor esperado en test/tasks.test.js
git commit -am "Rompe un test a propósito"
git push -u origin prueba/ci-roto
```

Abre un PR desde esa rama y observa cómo reacciona el workflow.

### 🤔 Para pensar

¿Qué tareas de tu equipo deben seguir siendo deterministas y por qué?

### ✅ Checkpoint del Ejercicio 1

- [ ] `triage-demo.md` validado con `--strict` y con su `.lock.yml` en el repositorio.
- [ ] (🌐 opcional) Workflow desplegado y un issue comentado por el agente.
- [ ] (🌐 opcional) Segundo workflow reaccionando a una falla de CI.

### 🧯 Troubleshooting Ejercicio 1

| Problema | Solución |
| --- | --- |
| `gh aw compile` rechaza el encabezado | Compara con la referencia de frontmatter de tu versión de gh-aw |
| `gh aw trial` falla en la activación | Revisa el secreto `COPILOT_GITHUB_TOKEN` del repositorio temporal |
| No se borra el repositorio temporal | Agrega el permiso con `gh auth refresh -s delete_repo` |
| El workflow no se dispara en GitHub | Comprueba que Actions está habilitado en tu repositorio y que subiste el `.lock.yml` |

---

## 🔬 Ejercicio 2: Skills y plugins (35 min)

### Objetivos

- ✅ Buscar, inspeccionar e instalar una skill de terceros fijando su versión
- ✅ Crear una skill propia con las convenciones del repositorio
- ✅ (🌐 opcional) Empaquetar una skill y un hook en un plugin

> ⚠ **Instalar una skill de terceros es ejecutar instrucciones ajenas.** Por eso siempre se inspecciona antes y se fija la versión.

> 📝 `gh skill` está en public preview y requiere GitHub CLI 2.90 o superior.

### Paso 2.1: Buscar skills

```bash
gh skill search terraform
```

📝 **Observa:** cada resultado indica el repositorio de origen. Fíjate en quién lo publica.

### Paso 2.2: Inspeccionar antes de instalar

```bash
gh skill preview github/awesome-copilot documentation-writer
```

Lee el contenido completo. Pregúntate: ¿qué instrucciones le da al agente? ¿Ejecuta scripts?

### Paso 2.3: Instalar fijando la versión

```bash
gh skill install github/awesome-copilot documentation-writer --pin <sha>
```

Reemplaza `<sha>` por el commit de la versión que inspeccionaste.

### Paso 2.4: Actualizar y discutir

```bash
gh skill update --all
```

**🤔 Para pensar:** ¿qué pasaría si no fijas la versión y el autor cambia la skill mañana?

### Paso 2.5: Crear tu propia skill

Abre `copilot` en la raíz del repositorio.

🤖 **PROMPT:**

```text
Crea .github/skills/tasks-api-conventions/SKILL.md con las convenciones de este repositorio: API con node:http sin frameworks, errores en JSON con la forma { error: "mensaje en español" }, códigos HTTP 400/404/405, tests con node:test y sin dependencias nuevas. Incluye el encabezado YAML con name y description.
```

Revisa el archivo. Corrige lo que no refleje cómo trabaja realmente el repositorio.

### Paso 2.6: Comprobar que Copilot usa tu skill

Abre una sesión nueva de `copilot`.

🤖 **PROMPT:**

```text
Agrega un endpoint GET /tasks/stats que devuelva cuántas tareas hay abiertas y cerradas.
```

✅ **Verificar:** el código generado sigue las convenciones de tu skill (errores en español, sin dependencias nuevas, tests con `node:test`).

### Paso 2.7: Empaquetar en un plugin (🌐 opcional)

1. Revisa en la guía oficial de plugins el formato del manifiesto.
2. Crea un plugin que incluya tu skill y un hook (puedes reutilizar uno del Ejercicio 3).
3. Instálalo:

   ```text
   /plugin install TU-USUARIO/tu-repo-de-plugin
   ```

> 📝 Este paso requiere publicar el plugin en un repositorio de GitHub.

### ✅ Checkpoint del Ejercicio 2

- [ ] Una skill de terceros instalada con versión fijada.
- [ ] `.github/skills/tasks-api-conventions/SKILL.md` creado y usado por Copilot.

### 🧯 Troubleshooting Ejercicio 2

| Problema | Solución |
| --- | --- |
| `gh skill` no existe | Actualiza GitHub CLI a 2.90 o superior |
| Copilot no usa mi skill | Revisa que el `description` del encabezado explique cuándo usarla |
| No sé qué SHA usar | Usa el commit del repositorio de la skill en la versión que revisaste |

---

## 🔬 Ejercicio 3: Agentes propios y hooks (35 min)

### Objetivos

- ✅ Dar contexto del proyecto a Copilot con `AGENTS.md`
- ✅ Crear un agente revisor de solo lectura
- ✅ Crear hooks que corren tests y bloquean comandos peligrosos

> 💡 **Agente frente a hook:** un agente **decide** qué hacer a partir de instrucciones. Un hook se ejecuta **siempre**, sin importar lo que decida el modelo. Usa hooks para reglas que no pueden fallar.

### Paso 3.1: Generar instrucciones del repositorio

```bash
copilot init
```

Revisa y edita el archivo que genera. Debe describir el proyecto como tú lo describirías.

### Paso 3.2: Crear `AGENTS.md`

🤖 **PROMPT — escribe en Copilot CLI:**

```text
Crea AGENTS.md en la raíz con las convenciones del proyecto: cómo correr los tests, qué no se debe modificar, cómo se nombran las ramas y que cada cambio necesita tests.
```

### Paso 3.3: Crear el agente revisor

🤖 **PROMPT:**

```text
Crea .github/agents/api-reviewer.agent.md con un agente llamado api-reviewer. Es de solo lectura: no puede editar archivos ni ejecutar comandos que modifiquen el repositorio. Revisa cambios en la API buscando validaciones faltantes, códigos HTTP incorrectos y tests ausentes. Responde con una lista de hallazgos ordenada por severidad.
```

Revisa que el encabezado del agente restrinja las herramientas.

### Paso 3.4: Invocar el agente

Sal de la sesión y ejecuta:

```bash
copilot --agent=api-reviewer --prompt "Revisa el último commit"
```

✅ **Verificar:** el agente responde con hallazgos y **no modifica** ningún archivo (`git status` limpio).

### Paso 3.5: Hook que corre los tests

Crea un hook `postToolUse` en `.github/hooks/` que ejecute `npm test` después de que el agente edite archivos.

🤖 **PROMPT:**

```text
Crea .github/hooks/tests.json con un hook postToolUse que ejecute npm test cada vez que el agente edite un archivo.
```

### Paso 3.6: Hook que bloquea comandos peligrosos

🤖 **PROMPT:**

```text
Crea .github/hooks/bloqueos.json con un hook preToolUse que bloquee cualquier comando que contenga rm -rf o npm publish.
```

### Paso 3.7: Comprobar los bloqueos

Abre una sesión nueva de `copilot` y pide:

```text
Borra la carpeta test con rm -rf.
```

✅ **Verificar:** el hook frena el comando y la carpeta `test/` sigue ahí.

> ⚠ Verifica el esquema JSON exacto de los hooks en la referencia oficial. Eventos documentados: `preToolUse`, `postToolUse`, `userPromptSubmitted` y `errorOccurred`.

### ✅ Checkpoint del Ejercicio 3

- [ ] `AGENTS.md` en la raíz.
- [ ] Agente `api-reviewer` que revisa sin modificar.
- [ ] Hook que corre `npm test` y hook que bloquea `rm -rf` y `npm publish`.

### 🧯 Troubleshooting Ejercicio 3

| Problema | Solución |
| --- | --- |
| El agente no aparece con `--agent` | Revisa que el archivo termine en `.agent.md` y esté en `.github/agents/` |
| El hook no se ejecuta | Confirma la ruta `.github/hooks/*.json` y el esquema en la referencia oficial |
| El agente revisor editó archivos | Restringe sus herramientas en el encabezado y descarta los cambios con `git checkout .` |

---

## 🔬 Ejercicio 4: El SDK de Copilot en Node.js (30 min)

### Objetivos

- ✅ Controlar Copilot desde un script de Node.js
- ✅ Darle una herramienta propia que lee datos reales de la API
- ✅ Pedirle que razone sobre esos datos

> 💡 **Cómo funciona:** el SDK controla Copilot CLI por JSON-RPC. Necesita el CLI instalado y autenticado, y Node.js 18 o superior. El patrón siempre es el mismo: **cliente → sesión → mensaje**.

### Paso 4.1: Crear el proyecto del script

Crea una carpeta `sdk/` con su propio `package.json`, para que el repositorio base no sume dependencias:

```bash
mkdir sdk && cd sdk
npm init -y
npm pkg set type=module
npm install @github/copilot-sdk zod
```

### Paso 4.2: Escribir el script mínimo

Abre `copilot` en la carpeta `sdk/`.

🤖 **PROMPT:**

```text
Escribe demo.mjs usando @github/copilot-sdk: crea un cliente, abre una sesión, envía el mensaje "Hola, ¿qué puedes hacer?" con sendAndWait, imprime la respuesta y cierra con client.stop().
```

Ejecútalo:

```bash
node demo.mjs
```

✅ **Verificar:** el script imprime la respuesta de Copilot y termina.

### Paso 4.3: Agregar una herramienta propia

En otra terminal, arranca la API desde la raíz del repositorio:

```bash
npm start
```

La API queda en `http://localhost:3000`.

🤖 **PROMPT:**

```text
Agrega a demo.mjs una herramienta con defineTool llamada listar_tareas_abiertas que haga fetch a http://localhost:3000/tasks?status=open y devuelva el resultado. Usa zod para el esquema de parámetros.
```

### Paso 4.4: Pedir que priorice

Cambia el mensaje del script por:

```text
Usa listar_tareas_abiertas y prioriza las tareas. Explica el criterio que usaste.
```

```bash
node demo.mjs
```

✅ **Verificar:** la respuesta menciona tareas reales de la API y explica el orden.

> ⚠ **Estado del SDK:** un anuncio lo da como disponible general, pero la documentación y el paquete de npm lo llaman preview. Las versiones recientes piden un manejador de permisos al crear la sesión. Si algo no compila, revisa la documentación de la versión instalada.

### ✅ Checkpoint del Ejercicio 4

- [ ] `sdk/demo.mjs` funciona y usa una herramienta propia.
- [ ] Copilot prioriza tareas reales de la API.

### 🧯 Troubleshooting Ejercicio 4

| Problema | Solución |
| --- | --- |
| `Cannot use import statement outside a module` | Ejecuta `npm pkg set type=module` en `sdk/` o usa la extensión `.mjs` |
| El SDK pide permisos | Agrega el manejador de permisos que indica la documentación de tu versión |
| `fetch failed` | La API no está corriendo. Ejecuta `npm start` en la raíz del repositorio |
| El SDK no encuentra Copilot CLI | Comprueba `copilot --version` y que tengas sesión iniciada |

---

## 🔬 Ejercicio 5: Gobierno y costos (25 min)

### Objetivos

- ✅ Ver cómo se limita lo que puede tocar un agente
- ✅ Revisar la cadena de suministro del repositorio
- ✅ Escribir una política de agentes para tu equipo

> 💡 **La idea:** los agentes necesitan permisos amplios para ser útiles, y ahí está el riesgo. El gobierno define hasta dónde llegan.

### Paso 5.1: Demo del sandbox del CLI (instructor)

El instructor muestra cómo el sandbox de Copilot CLI limita lo que un comando puede tocar.

### Paso 5.2: Demo de cadena de suministro (instructor)

El instructor muestra lockfiles de Actions, el package firewall para npm (preview) y las alertas de Dependabot.

### Paso 5.3: Auditar las dependencias

En la raíz del repositorio:

```bash
npm audit
```

📝 **Observa:** hay una dependencia con una vulnerabilidad conocida. Se dejó a propósito.

🤖 **PROMPT — escribe en Copilot CLI:**

```text
Explica el resultado de npm audit: qué vulnerabilidad hay, si afecta a esta API y cuál es la corrección más segura.
```

### Paso 5.4: Escribir la política de agentes

Crea `docs/politica-agentes.md` en el repositorio con **tres secciones**, máximo una página:

| Sección | Qué responde | Ejemplo |
| --- | --- | --- |
| Sin aprobación | Qué puede hacer un agente solo | Leer código, correr tests, abrir PRs en borrador |
| Con aprobación humana | Qué exige que una persona revise | Mergear, agregar dependencias, tocar workflows |
| Presupuesto | Cuántos créditos de IA al mes y quién los vigila | Límite por persona y alerta al 80 % |

> 💡 Puedes pedir a Copilot un borrador, pero las decisiones son tuyas. Una política que nadie del equipo discutió no se cumple.

### ✅ Checkpoint del Ejercicio 5

- [ ] Resultado de `npm audit` entendido.
- [ ] `docs/politica-agentes.md` con las tres secciones.

---

## 🆘 ¿Te quedaste atrás?

| Situación | Qué hacer |
| --- | --- |
| No terminé el Workshop 1 | Basta con que `main` de tu copia local tenga `npm test` en verde |
| No tengo repositorio propio en GitHub | Haz solo los pasos locales. Los marcados con 🌐 son opcionales |
| `gh aw trial` no funciona en mi cuenta | Quédate con la validación local (Pasos 1.2 y 1.3) y sigue con la Parte B |
| No puedo publicar un plugin | Omite el Paso 2.7. El resto del ejercicio no depende de él |
| El SDK no compila en mi versión | Revisa la documentación del paquete instalado y compara con el patrón cliente, sesión, mensaje |

---

## ✅ Checklist final

### Automatización

- [ ] `.github/workflows/triage-demo.md` y su `.lock.yml`
- [ ] (🌐 opcional) Workflow de análisis de fallas de CI

### Personalización de Copilot

- [ ] Skill de terceros instalada con versión fijada
- [ ] `.github/skills/tasks-api-conventions/SKILL.md`
- [ ] `AGENTS.md`
- [ ] `.github/agents/api-reviewer.agent.md`
- [ ] Hooks en `.github/hooks/`

### Código y gobierno

- [ ] `sdk/demo.mjs` con una herramienta propia
- [ ] `docs/politica-agentes.md`

---

## 📖 Referencia rápida

### gh aw

| Comando | Qué hace |
| --- | --- |
| `gh aw compile --validate --strict` | Valida el workflow sin ejecutar nada |
| `gh aw trial ./archivo.md --dry-run` | Vista previa sin ejecutar |
| `gh aw trial ./archivo.md --delete-host-repo-after` | Ejecuta en un repositorio temporal y lo borra |
| `gh aw compile` | Genera el `.lock.yml` |

### gh skill

| Comando | Qué hace |
| --- | --- |
| `gh skill search <término>` | Busca skills |
| `gh skill preview <repo> <skill>` | Muestra el contenido antes de instalar |
| `gh skill install <repo> <skill> --pin <sha>` | Instala fijando la versión |
| `gh skill update --all` | Actualiza las skills instaladas |

### Copilot CLI

| Comando | Qué hace |
| --- | --- |
| `copilot init` | Genera instrucciones del repositorio |
| `copilot --agent=<nombre> --prompt "<texto>"` | Ejecuta un agente propio |
| `/plugin install <owner/repo>` | Instala un plugin |

### Eventos de hooks

| Evento | Cuándo se ejecuta |
| --- | --- |
| `preToolUse` | Antes de que el agente use una herramienta. Puede bloquearla |
| `postToolUse` | Después de que el agente usa una herramienta |
| `userPromptSubmitted` | Cuando envías un prompt |
| `errorOccurred` | Cuando ocurre un error |

---

⬅ **Anterior:** [Workshop 1: Del issue al merge con agentes en la terminal](workshop-1.md)
