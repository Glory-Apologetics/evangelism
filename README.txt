YOU FOUND JESUS - AUDIO DEPLOY FIX

Replace ONLY these two files in your GitHub repository:
1. build.js
2. script.js

IMPORTANT:
KEEP your existing audio/ folder exactly as it is, including:
audio/cinematic-bg.mp3

The previous build.js copied only index.html, style.css and script.js into dist/, so audio/cinematic-bg.mp3 was left out of the deployed build. This build.js copies the entire audio/ folder into dist/.

Do NOT delete the existing audio/ folder from GitHub.
