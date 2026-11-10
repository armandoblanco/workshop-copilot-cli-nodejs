#!/usr/bin/env node
// Verifica que tu máquina está lista para los workshops.
// Solo lee versiones. No instala nada ni modifica tu configuración.

import { execFileSync } from 'node:child_process';

const results = [];

function run(cmd, args) {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

function parseVersion(text) {
  const match = text?.match(/(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1, 4).map(Number) : null;
}

function atLeast(actual, required) {
  if (!actual) return false;
  for (let i = 0; i < 3; i++) {
    if (actual[i] > required[i]) return true;
    if (actual[i] < required[i]) return false;
  }
  return true;
}

function check(name, ok, detail, fix) {
  results.push({ name, ok, detail, fix });
}

// Node.js
const node = parseVersion(process.version);
check('Node.js 22 o superior', atLeast(node, [22, 0, 0]), process.version, 'Instala Node.js 22 LTS o superior.');

// Git
const gitOut = run('git', ['--version']);
check('Git 2.20 o superior', atLeast(parseVersion(gitOut), [2, 20, 0]), gitOut ?? 'no encontrado', 'Instala Git desde git-scm.com.');

// GitHub CLI
const ghOut = run('gh', ['--version'])?.split('\n')[0];
check('GitHub CLI 2.90 o superior', atLeast(parseVersion(ghOut), [2, 90, 0]), ghOut ?? 'no encontrado', 'Instala o actualiza GitHub CLI (cli.github.com).');

// Sesión de gh
const auth = run('gh', ['auth', 'status']);
check('Sesión de gh iniciada', auth !== null, auth ? 'ok' : 'sin sesión', 'Ejecuta: gh auth login --scopes repo,workflow');

// Copilot CLI
const copilotOut = run('copilot', ['--version'])?.split('\n')[0] ?? null;
check('Copilot CLI instalado', copilotOut !== null, copilotOut ?? 'no encontrado', 'Ejecuta: npm install -g @github/copilot');

// Extensiones de gh (necesarias para Workshop 1 M4 y Workshop 2 M1)
const extensions = run('gh', ['extension', 'list']) ?? '';
check('Extensión gh-stack', /gh-stack/.test(extensions), /gh-stack/.test(extensions) ? 'instalada' : 'falta', 'Ejecuta: gh extension install github/gh-stack');
check('Extensión gh-aw', /gh-aw/.test(extensions), /gh-aw/.test(extensions) ? 'instalada' : 'falta', 'Ejecuta: gh extension install github/gh-aw');

const width = Math.max(...results.map((r) => r.name.length));
let failed = 0;
for (const r of results) {
  const mark = r.ok ? 'OK ' : 'FALTA';
  console.log(`${mark.padEnd(6)} ${r.name.padEnd(width)}  ${r.detail}`);
  if (!r.ok) {
    failed++;
    console.log(`       -> ${r.fix}`);
  }
}

console.log();
if (failed === 0) {
  console.log('Todo listo.');
} else {
  console.log(`${failed} elemento(s) por resolver antes del workshop.`);
  process.exitCode = 1;
}
