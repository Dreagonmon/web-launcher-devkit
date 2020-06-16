const p1 = Deno.run({
  cmd: [Deno.execPath(),"run","--allow-net","https://dreagonmon.github.io/web-launcher-devkit/scripts/dev_server.js","-p","10801"],
})
const p2 = Deno.run({
  cmd: [Deno.execPath(),"run","--allow-net","--allow-read","https://dreagonmon.github.io/web-launcher-devkit/scripts/file_server.js","-p","1080"],
})
await p1.status();
await p2.status();