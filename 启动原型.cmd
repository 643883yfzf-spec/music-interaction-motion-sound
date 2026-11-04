@echo off
cd /d "%~dp0"
echo Open http://localhost:8765 in your browser. Close this window to stop.
if exist "C:\Users\RAION\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" (
  "C:\Users\RAION\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" "%~dp0serve.py"
) else (
  python "%~dp0serve.py"
)
pause
