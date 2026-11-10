# Workshops de GitHub Copilot CLI con Node.js

Dos laboratorios prácticos de 3 horas para desarrolladores JavaScript que ya tienen licencia de GitHub Copilot. Se trabaja en la terminal con Copilot CLI, GitHub CLI (`gh`) y una API de tareas escrita en Node.js.

Los temas son los lanzamientos de Copilot de agosto a noviembre de 2026 (entre ellos Copilot Fusion) más rubber duck, que es anterior pero forma parte del flujo de revisión. Estos workshops no son una introducción a Copilot: asumen que ya lo usas en el editor.

> **Sobre los temas nuevos.** Copilot CLI publica versiones cada pocos días y varias funciones de estos laboratorios están en preview. Los comandos salen de la documentación y el changelog oficiales. Si algo no coincide con tu versión, consulta la documentación, anótalo y sigue. Esta guía dice cuándo algo no está confirmado.

## Escenario

Eres parte del equipo de soporte de **Contoso Servicios**. Heredaste una API interna de tareas que funciona, pero tiene defectos. A lo largo de los dos workshops la corriges, la extiendes y construyes automatizaciones alrededor de ella, usando agentes con revisión humana en cada paso. Contoso es una empresa ficticia.

## Qué aprenderás

**Workshop 1: del issue al merge con agentes en el terminal**

- Elegir entre Fusion Standard, High, Auto y un modelo fijo, y medir la diferencia.
- Planear con Copilot y criticar el plan con rubber duck.
- Trabajar en paralelo con worktrees y delegar a la nube con `/delegate`.
- Dividir un cambio en PRs apilados con `gh stack`.
- Revisar código generado por agentes con una checklist humana.

**Workshop 2: automatización agéntica con gobierno**

- Escribir Agentic Workflows en Markdown y probarlos con `gh aw trial`.
- Instalar skills con `gh skill`, fijando versión, y crear las tuyas.
- Crear agentes propios y hooks que bloquean comandos peligrosos.
- Usar el Copilot SDK desde Node.js con una herramienta propia.
- Redactar una política de una página sobre qué pueden hacer los agentes sin aprobación.

## Requisitos

| Herramienta | Versión | Comprobación |
| --- | --- | --- |
| Licencia de Copilot | Activa. Si viene de una organización, la política de Copilot CLI debe estar habilitada | `copilot` abre sesión |
| Node.js | 22 o superior | `node -v` |
| Git | 2.20 o superior | `git --version` |
| GitHub CLI | 2.90 o superior | `gh --version` |
| Copilot CLI | Última | `npm install -g @github/copilot`, luego `copilot --version` |
| Extensiones de `gh` | `gh-stack` y `gh-aw` | `gh extension install github/gh-stack` y `gh extension install github/gh-aw` |

Prueba todo de una vez con:

```bash
npm run check:setup
```

El script solo lee versiones, no instala nada. Te dice qué falta y cómo resolverlo.

## Cómo empezar

1. Haz un **fork** de [armandoblanco/workshop-copilot-cli-nodejs](https://github.com/armandoblanco/workshop-copilot-cli-nodejs) y clónalo. Trabaja siempre en tu fork.

```bash
gh repo fork armandoblanco/workshop-copilot-cli-nodejs --clone
cd workshop-copilot-cli-nodejs
```

2. Habilita GitHub Actions en el fork (Settings, Actions).
3. Instala y prueba:

```bash
npm ci
npm test
```

**Deben fallar exactamente 2 tests.** Son del filtro `?due=` y es lo esperado: los corregirás en el Workshop 1. Si fallan más o menos, algo está distinto en tu entorno.

4. Sigue la guía de cada workshop:
   - [Workshop 1](docs/workshop-1.md)
   - [Workshop 2](docs/workshop-2.md)

## Estructura del repositorio

```text
src/                 API en Node.js (node:http, sin frameworks)
test/                Pruebas con node:test
scripts/             check-setup, seed-issues y export-participant
docs/                Guías de laboratorio de cada workshop
.github/             CI, plantillas de issues y PR, Dependabot
```

## Cómo está diseñado

- **Práctico primero.** Cada módulo termina en algo que ejecutas y verificas, con un checkpoint.
- **Sin dependencias que no hagan falta.** La API usa solo módulos de Node.js, salvo una dependencia sembrada a propósito para el módulo de gobierno del Workshop 2.
- **Defectos intencionales.** El repo tiene fallas reales que los laboratorios usan. No están listadas aquí para que las descubras con los agentes. El instructor tiene la lista.
- **Revisión humana siempre.** Cada módulo con agentes termina con una pregunta sobre qué revisaste, no solo sobre qué generó el agente.
- **Costos visibles.** Anotas los créditos de IA que consumes en cada enfoque.
- **Honestidad sobre los límites.** Las funciones en preview están marcadas y los comandos sin confirmar también.

## Buenas prácticas durante los laboratorios

- Trabaja en tu fork y en ramas. No uses repositorios de tu organización.
- Lee cada cambio antes de aprobarlo. No des permisos amplios a un agente por comodidad.
- No pongas secretos en prompts, archivos ni logs.
- No modifiques los tests para que pasen. Corrige el código.
- Antes de aceptar una dependencia nueva, pregunta por qué hace falta.
- Anota los créditos de IA que consumes: los agentes en paralelo multiplican el costo.
- Si algo queda en un estado confuso, usa `git status` y vuelve a un commit conocido antes de seguir.

## Para instructores

La guía del instructor, la lista de fallas sembradas y las soluciones de referencia no se publican en este repositorio. Pídelas al autor.

Antes de impartirlo, haz un ensayo completo en una cuenta limpia. Ningún comando de Copilot CLI, `gh stack`, `gh skill` o `gh aw` fue ejecutado al preparar este material.

## Contenido sujeto a cambios

Referencias oficiales:

- [Documentación de GitHub Copilot](https://docs.github.com/en/copilot)
- [Copilot Fusion](https://docs.github.com/en/copilot/concepts/models/copilot-fusion)
- [Rubber duck en Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)
- [GitHub Agentic Workflows](https://github.github.com/gh-aw/)
- [Changelog de GitHub](https://github.blog/changelog/)

## Licencia

MIT. Consulta [LICENSE](LICENSE).
