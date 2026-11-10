#!/usr/bin/env bash
# Genera una copia para participantes SIN la carpeta instructor/ (soluciones y archivos de referencia).
# Uso: ./scripts/export-participant.sh [carpeta-destino]
# Requiere: tar (viene con macOS, Linux y Windows 10 o superior).

set -euo pipefail

DEST="${1:-../workshop-copilot-cli-nodejs-participantes}"

mkdir -p "$DEST"
tar --exclude='./instructor' --exclude='./node_modules' --exclude='./.git' -cf - . | tar -xf - -C "$DEST"

echo "Copia para participantes creada en: $DEST"
echo "Revisa que README.md no enlace a instructor/ antes de publicarla."
