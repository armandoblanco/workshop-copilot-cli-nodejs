#!/usr/bin/env bash
# Crea 4 issues de ejemplo en TU repositorio de GitHub para practicar triage (Workshop 2, ejercicio 0).
# Uso: ./scripts/seed-issues.sh owner/repo
# Requiere: gh con sesión iniciada. Pide confirmación antes de crear nada.

set -euo pipefail

REPO="${1:-}"
if [[ -z "$REPO" ]]; then
  echo "Uso: $0 owner/repo" >&2
  exit 1
fi

echo "Se crearán 4 issues en: $REPO"
read -r -p "¿Continuar? [s/N] " answer
[[ "$answer" =~ ^[sS]$ ]] || { echo "Cancelado."; exit 0; }

gh issue create --repo "$REPO" \
  --title "El filtro ?due= devuelve tareas que no corresponden" \
  --body "Cuando filtro por fecha con tareas creadas en otras zonas horarias, a veces aparece una tarea que vence después del corte y falta otra que vence antes."

gh issue create --repo "$REPO" \
  --title "¿Cómo marco una tarea como hecha?" \
  --body "Soy nuevo en la API. No encuentro cómo cambiar el estado de una tarea."

gh issue create --repo "$REPO" \
  --title "Poder filtrar tareas por responsable" \
  --body "Mi equipo necesita ver solo las tareas asignadas a cada persona. Hoy las tareas no tienen responsable."

gh issue create --repo "$REPO" \
  --title "No funciona" \
  --body "Intenté usarlo y falla."

echo "Listo. Revisa la pestaña Issues de $REPO."
