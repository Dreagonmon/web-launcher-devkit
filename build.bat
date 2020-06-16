rd /s /q dist
mkdir dist
mkdir dist\scripts
deno bundle "scripts\dev_server.ts" > "dist\scripts\dev_server.js"
deno bundle "scripts\file_server.ts" > "dist\scripts\file_server.js"
deno bundle "scripts\dev.js" > "dist\scripts\dev.js"
copy README.md "dist\README.md"
xcopy "examples" "dist\examples\" /c /e /h /k /r /y