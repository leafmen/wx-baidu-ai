@echo off
set "str=%~dp0"

start cmd /k "cd/d %str% && node index.js"
