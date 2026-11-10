# Workshop 2: automatización agéntica con gobierno

**Duración:** 180 minutos. **Formato:** laboratorio individual, siguiendo esta guía.
**Prerrequisito:** Workshop 1 terminado, o tu fork de `main` con `npm test` en verde.

## Qué vas a lograr

Al terminar tendrás un workflow agéntico en Actions, una skill y un plugin propios, un agente con hooks y un script en Node.js que usa el SDK de Copilot, y una política de una página para agentes de tu equipo.

Varias piezas de este workshop son preview o cambian rápido. Cuando un comando no coincida con tu versión, consulta la documentación oficial y anota la diferencia.

## Agenda

| Min | Módulo | Resultado |
| --- | --- | --- |
| 10 | M0 Arranque | Extensiones instaladas y fork con Actions activo |
| 45 | M1 Agentic Workflows | Triage de issues y análisis de fallas de CI en Markdown |
| 35 | M2 Skills y plugins | Una skill fijada por versión y un plugin propio |
| 35 | M3 Agentes y hooks | Un agente revisor y un hook que corre tests y bloquea comandos |
| 30 | M4 SDK en Node.js | Un script que usa Copilot con una herramienta propia |
| 25 | M5 Gobierno y costos | Política de una página para agentes del equipo |

## M0: arranque (10 min)

1. `npm run check:setup` debe mostrar `gh-aw` instalada. Si falta: `gh extension install github/gh-aw`.
2. En tu fork, entra a Settings, Actions, y comprueba que están habilitadas.
3. Crea issues de práctica: `./scripts/seed-issues.sh tu-usuario/tu-fork`.

## M1: Agentic Workflows (45 min)

Se escriben en Markdown con encabezado YAML. `gh aw compile` valida el archivo y genera un `.lock.yml` que Actions ejecuta. Corren con permisos de solo lectura y escriben solo mediante salidas seguras preaprobadas. Complementan a los workflows deterministas, no los reemplazan. El motor por defecto es Copilot CLI y requiere licencia.

### Parte A: probar sin tocar tu repo

No hay una ejecución 100% local del agente. Lo más cercano son dos pasos: validar en tu máquina y ejecutar en un repo temporal privado que el CLI crea y que puedes borrar.

1. Crea una carpeta vacía con un archivo `triage-demo.md`. Escríbelo tú siguiendo el quickstart oficial de gh-aw: es parte del aprendizaje. Debe activarse al abrirse un issue, tener permisos de solo lectura, usar el motor `copilot` y poder escribir un solo comentario mediante `safe-outputs`.
2. Validación local, sin ejecutar el agente ni crear nada en GitHub: `gh aw compile --validate --strict`.
3. Vista previa sin ejecutar: `gh aw trial ./triage-demo.md --dry-run`. Usa la ruta con `./`, si no el CLI puede interpretarla como un repositorio.
4. Ejecución real en un repo temporal: `gh aw trial ./triage-demo.md --delete-host-repo-after`.
5. Para un workflow disparado por issues, pasa contexto con `--trigger-context <url-de-un-issue>`.

Límites:

- El agente corre en GitHub Actions del repo temporal, no en tu máquina, y consume créditos de IA.
- Los secretos de tu fork no se heredan. El repo temporal necesita su propio `COPILOT_GITHUB_TOKEN`.
- Borrar el repo temporal requiere el permiso `delete_repo` en tu token de `gh`.

### Parte B: desplegar en tu fork

1. Copia el workflow a `.github/workflows/`, compila con `gh aw compile` y haz commit del `.md` y del `.lock.yml`.
2. Abre un issue nuevo y observa la ejecución en la pestaña Actions.
3. Comprueba que el agente solo comentó (es lo único que permite `safe-outputs`).
4. Crea un segundo workflow que analice un fallo de CI. Rompe un test a propósito para dispararlo.

**Para pensar:** qué tareas deben seguir siendo deterministas y por qué.

## M2: skills y plugins (35 min)

`gh skill` es public preview y requiere GitHub CLI 2.90 o superior.

1. Busca: `gh skill search terraform`.
2. Inspecciona antes de instalar: `gh skill preview github/awesome-copilot documentation-writer`.
3. Instala fijando versión: `gh skill install github/awesome-copilot documentation-writer --pin <sha>`.
4. Actualiza con `gh skill update --all` y discute por qué se fija una versión.
5. Crea tu skill en `.github/skills/tasks-api-conventions/SKILL.md` con las convenciones del repo y comprueba que Copilot la usa cuando es relevante.
6. Empaqueta la skill y un hook en un plugin e instálalo con `/plugin install owner/repo`. Verifica el formato del manifiesto en la guía oficial de plugins.

Instalar una skill de terceros es ejecutar instrucciones ajenas. Por eso se inspecciona y se fija.

## M3: agentes propios y hooks (35 min)

Un agente propio es un archivo `.agent.md` en `.github/agents/` (del repo) o `~/.copilot/agents/` (personal). Los hooks son comandos que se ejecutan de forma determinista en puntos del flujo del agente y se declaran en `.github/hooks/*.json`.

1. Ejecuta `copilot init` para generar instrucciones del repositorio y edítalas. Agrega un `AGENTS.md` con las convenciones del proyecto.
2. Crea el agente `api-reviewer`, de solo lectura, que revisa cambios en la API.
3. Invócalo: `copilot --agent=api-reviewer --prompt "Revisa el último commit"`.
4. Crea un hook posterior a las herramientas que corra `npm test` después de editar archivos.
5. Crea un hook previo que bloquee `rm -rf` y `npm publish`. Intenta que el agente los ejecute y comprueba que se frenan.

Verifica el esquema JSON exacto de los hooks en la referencia oficial. Eventos documentados: `preToolUse`, `postToolUse`, `userPromptSubmitted` y `errorOccurred`.

## M4: el SDK de Copilot en Node.js (30 min)

El SDK controla Copilot CLI por JSON-RPC: necesita el CLI instalado y autenticado, y Node.js 18 o superior. El patrón es cliente, sesión y mensaje.

1. Crea una carpeta `sdk/` fuera del código de la API y ejecuta `npm install @github/copilot-sdk zod`. Así el repo base no suma dependencias.
2. Escribe un script mínimo: crea el cliente, abre una sesión, envía un mensaje con `sendAndWait` y cierra con `client.stop()`.
3. Agrega una herramienta propia con `defineTool` que lea las tareas abiertas de la API (`npm start` en otra terminal).
4. Pide a Copilot que las priorice y explique el criterio.

El estado del SDK es ambiguo: un anuncio lo da como disponible general, pero la documentación y el paquete de npm lo llaman preview. Las versiones recientes piden además un manejador de permisos al crear la sesión. Si algo no compila, revisa la documentación de la versión instalada.

## M5: gobierno y costos (25 min)

Los agentes necesitan permisos amplios para ser útiles, y ahí está el riesgo.

- **Demo, sandbox del CLI:** cómo limita lo que un comando puede tocar.
- **Demo, cadena de suministro:** lockfiles de Actions, package firewall para npm (preview) y alertas de Dependabot. Ejecuta `npm audit` en este repo y analiza el resultado.
- **Ejercicio:** escribe una política de una página con tres secciones: qué puede hacer un agente sin aprobación, qué exige a una persona y cuál es el presupuesto mensual de créditos de IA.

## Si algo sale mal

| Problema | Qué hacer |
| --- | --- |
| `gh aw trial` falla en la activación | Revisa el secreto `COPILOT_GITHUB_TOKEN` del repo temporal |
| `gh aw compile` rechaza el encabezado | Compara con la referencia de frontmatter de tu versión de gh-aw |
| El hook no se ejecuta | Confirma la ruta `.github/hooks/*.json` y el esquema en la referencia oficial |
| El SDK pide permisos | Agrega el manejador de permisos que indica la documentación de tu versión |
