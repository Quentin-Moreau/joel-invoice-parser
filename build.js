// build.js — Zero-dependency Node.js script that bundles index.html + pdf.js libs
// into a single self-contained invoice-parser.html file.
//
// Usage: node build.js

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// ── Read source files ────────────────────────────────────────────
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
const pdfJsLib = fs.readFileSync(path.join(ROOT, 'pdf-js.min.js'), 'utf-8');
const workerJs = fs.readFileSync(path.join(ROOT, 'pdf-js.worker.min.js'), 'utf-8');

// ── Inline pdf-js.min.js ─────────────────────────────────────────
// Escape </script> to prevent premature closing of the inline script tag
const escapedLib = pdfJsLib.replace(/<\//g, '<\\/');
const inlinedLib = `<script>${escapedLib}</script>`;

// ── Inline pdf-js.worker.min.js as a Blob URL ────────────────────
// Base64-encode to safely embed any characters (including </script>)
const workerBase64 = Buffer.from(workerJs, 'utf-8').toString('base64');
const workerBlobSetup =
`    var _workerCode = atob('${workerBase64}');
    var _workerBlob = new Blob([_workerCode], { type: 'application/javascript' });
    pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(_workerBlob);`;

// ── Apply replacements ───────────────────────────────────────────
let output = html;
output = output.replace('<script src="pdf-js.min.js"></script>', inlinedLib);
// Replace the BUILD:WORKER placeholder + the following workerSrc line
output = output.replace(/    <!-- BUILD:WORKER -->[\r\n]+    pdfjsLib\.GlobalWorkerOptions\.workerSrc = 'pdf-js\.worker\.min\.js';/, workerBlobSetup);

// ── Write output ─────────────────────────────────────────────────
const outPath = path.join(ROOT, 'invoice-parser.html');
fs.writeFileSync(outPath, output, 'utf-8');

console.log(`Built ${outPath}`);
