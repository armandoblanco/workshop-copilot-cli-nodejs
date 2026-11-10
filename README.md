# 🧑‍💻 Workshops: GitHub Copilot CLI con Node.js

## Agentes en la terminal para el equipo de Contoso Servicios

**Duración:** 2 laboratorios de 3 horas · **Nivel:** intermedio · **Idioma:** español

---

## 📋 Tabla de contenidos

- [Introducción](#-introducción)
- [Escenario: Contoso Servicios](#-escenario-contoso-servicios)
- [Los dos workshops](#-los-dos-workshops)
- [Pre-requisitos](#-pre-requisitos)
- [Cómo empezar](#-cómo-empezar)
- [Estructura del repositorio](#-estructura-del-repositorio)
- [Buenas prácticas durante los laboratorios](#-buenas-prácticas-durante-los-laboratorios)
- [Preguntas frecuentes](#-preguntas-frecuentes)
- [Referencias oficiales](#-referencias-oficiales)

---

## 🎯 Introducción

Estos laboratorios son para desarrolladores JavaScript que **ya usan GitHub Copilot en el editor** y quieren llevarlo a la terminal. No son una introducción a Copilot: aquí trabajas con agentes que leen el repositorio, proponen cambios, ejecutan comandos y abren pull requests, siempre con tu revisión.

Al terminar los dos workshops sabrás:

- ✅ Elegir el modelo adecuado (Fusion, Auto o un modelo fijo) y medir lo que cuesta
- ✅ Planear con Copilot y pedir una segunda opinión con rubber duck
- ✅ Trabajar con varios agentes en paralelo sin que se pisen
- ✅ Dividir un cambio grande en ramas apiladas (stacked PRs)
- ✅ Automatizar tareas con Agentic Workflows, skills, agentes propios y hooks
- ✅ Usar el SDK de Copilot desde Node.js
- ✅ Definir qué puede hacer un agente sin pedir permiso y qué no

> 💡 **Sobre los temas nuevos.** Copilot CLI publica versiones cada pocos días y varias funciones de estos laboratorios están en preview. Los comandos salen de la documentación y el changelog oficiales. Cuando algo no coincida con tu versión, revisa la documentación, anótalo y sigue. Las guías indican qué no está confirmado.

---

## 🏢 Escenario: Contoso Servicios

Eres parte del equipo de soporte de **Contoso Servicios**, una empresa ficticia. Heredaste una pequeña API de tareas escrita en Node.js que funciona, pero tiene defectos. A lo largo de los dos workshops la corriges, la extiendes y construyes automatizaciones a su alrededor.

| Método | Ruta | Qué hace |
| --- | --- | --- |
| `GET` | `/tasks` | Lista las tareas. Acepta los filtros `?due=` y `?status=` |
| `POST` | `/tasks` | Crea una tarea con `title` y `due` |
| `GET` | `/tasks/:id` | Consulta una tarea |
| `PATCH` | `/tasks/:id` | Cambia el estado (`open` o `done`) |
| `DELETE` | `/tasks/:id` | Elimina una tarea |

La API usa `node:http` sin frameworks, guarda los datos en memoria ([src/store.js](src/store.js)) y se prueba con `node:test`. Arranca con `npm start` en `http://localhost:3000`.

> 📝 El repositorio tiene **defectos intencionales** que los ejercicios usan. No están listados aquí para que los descubras con los agentes.

---

## 📚 Los dos workshops

| Workshop | Tema | Qué construyes |
| --- | --- | --- |
| [Workshop 1](docs/workshop-1.md) | Del issue al merge con agentes en la terminal | Corriges un bug, agregas paginación y validaciones, trabajas en paralelo y llevas el cambio hasta el merge |
| [Workshop 2](docs/workshop-2.md) | Automatización agéntica con gobierno | Un workflow agéntico, una skill, un agente con hooks, un script con el SDK y una política para tu equipo |

Haz el Workshop 1 primero. El Workshop 2 parte del código que dejaste en `main`.

> 🌐 **Leyenda:** los pasos marcados con 🌐 necesitan un repositorio propio en GitHub y son opcionales. Todo lo demás funciona en tu máquina.

---

## 🧰 Pre-requisitos

### Software

| Herramienta | Versión | Cómo comprobarla |
| --- | --- | --- |
| Node.js | 22 o superior | `node -v` |
| Git | 2.20 o superior | `git --version` |
| GitHub CLI | 2.90 o superior | `gh --version` |
| Copilot CLI | La más reciente | `copilot --version` |
| Extensiones de `gh` | `gh-stack` y `gh-aw` | `gh extension list` |

### Cuenta de GitHub

- Licencia de GitHub Copilot activa.
- Si la licencia viene de una organización, la política de **Copilot CLI** debe estar habilitada.
- Sesión iniciada en `gh` con permisos `repo` y `workflow`.

### Instalar lo que falta

```bash
npm install -g @github/copilot
gh auth login --scopes repo,workflow
gh extension install github/gh-stack
gh extension install github/gh-aw
```

---

## 🚀 Cómo empezar

### Paso 1: Clona el repositorio

```bash
git clone https://github.com/armandoblanco/workshop-copilot-cli-nodejs.git
cd workshop-copilot-cli-nodejs
git remote rename origin upstream
```

> 💡 Todo el laboratorio se hace **en local**, no necesitas un fork. Renombrar `origin` a `upstream` evita que un `git push` intente subir tus cambios. Si el taller se actualiza, tráelo con `git pull upstream main`.

### Paso 2: Repositorio propio en GitHub (🌐 opcional)

Algunos pasos están marcados con 🌐 porque necesitan GitHub: delegar a agentes en la nube, abrir PRs o ejecutar Actions. Son **opcionales**. Si quieres hacerlos, crea un repositorio privado tuyo desde la copia local:

```bash
gh repo create mi-workshop-copilot --private --source=. --remote=origin --push
```

Luego habilita Actions en ese repositorio: **Settings → Actions → General → Allow all actions and reusable workflows**.

> 📝 Si trabajas solo en local, omite este paso y los pasos 🌐 de las guías.

### Paso 3: Verifica tu entorno

```bash
npm run check:setup
```

El script solo lee versiones, no instala nada. Marca con `FALTA` lo que necesitas resolver y te dice cómo.

### Paso 4: Instala dependencias y corre los tests

```bash
npm ci
npm test
```

✅ **Verificar:**

- 8 tests pasan.
- **Exactamente 2 tests fallan**, ambos del filtro `?due=`. Es lo esperado: los corregirás en el Workshop 1.

> ⚠ Si fallan más o menos de 2, algo está distinto en tu entorno. Revisa tu versión de Node.js antes de seguir.

### Paso 5: Abre la guía

Continúa con el [Workshop 1](docs/workshop-1.md).

---

## 🗂 Estructura del repositorio

```text
src/          API en Node.js (node:http, sin frameworks)
test/         Pruebas con node:test
scripts/      check-setup, seed-issues y export-participant
docs/         Guías paso a paso de cada workshop
.github/      CI, plantillas de issues y PR, Dependabot
```

---

## 👍 Buenas prácticas durante los laboratorios

| Práctica | Por qué |
| --- | --- |
| Trabaja en local y en ramas | Un error de un agente no afecta a nadie más |
| Lee cada cambio antes de aprobarlo | Aprobar sin leer es la forma más rápida de aprender mal |
| No des permisos amplios por comodidad | Un agente con todos los permisos puede borrar o publicar |
| No pongas secretos en prompts, archivos ni logs | Todo lo que escribes puede terminar en un commit |
| No modifiques los tests para que pasen | Corrige el código, no la prueba |
| Pregunta por qué hace falta cada dependencia nueva | Cada paquete es código ajeno que ejecutas |
| Anota los créditos de IA que consumes | Los agentes en paralelo multiplican el costo |
| Si te pierdes, `git status` y vuelve a un commit conocido | Es más rápido que arreglar un estado confuso |

---

## 🙋 Preguntas frecuentes

### ¿Necesito saber usar Copilot antes?

Sí. Los workshops asumen que ya usas Copilot en el editor. Aquí no se explica qué es una sugerencia o cómo funciona el chat.

### ¿Por qué la API no usa Express?

Para que no haya dependencias innecesarias. La API usa solo módulos de Node.js, salvo una dependencia antigua que se sembró a propósito para el módulo de gobierno del Workshop 2.

### Un comando de la guía no existe en mi versión. ¿Qué hago?

Anótalo y sigue con el siguiente paso. Saber detectar que una función cambió es parte del aprendizaje. Consulta `copilot --help` o la documentación oficial.

### ¿Cuánto cuesta en créditos de IA?

Depende del modelo y de cuántos agentes uses. Cada ejercicio te pide anotarlo y el último módulo del Workshop 1 compara los resultados.

---

## 🔗 Referencias oficiales

- [Documentación de GitHub Copilot](https://docs.github.com/en/copilot)
- [Copilot Fusion](https://docs.github.com/en/copilot/concepts/models/copilot-fusion)
- [Rubber duck en Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)
- [GitHub Agentic Workflows](https://github.github.com/gh-aw/)
- [Changelog de GitHub](https://github.blog/changelog/)

> 🎓 **Para instructores:** la guía del instructor, la lista de defectos sembrados y las soluciones de referencia no se publican en este repositorio. Pídelas al autor. Antes de impartir el taller, haz un ensayo completo en una cuenta limpia.

---

## 📄 Licencia

MIT. Consulta [LICENSE](LICENSE).
