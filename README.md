# web-launcher-devkit
some deno script to development Android Launcher

## start development server
run dev server:

```bash
deno run --allow-net https://dreagonmon.github.io/web-launcher-devkit/scripts/dev_server.js -p 10801
```

run file server:

```bash
deno run --allow-net --allow-read https://dreagonmon.github.io/web-launcher-devkit/scripts/file_server.js -p 1080
```

run both with default port

```bash
deno run --allow-run --allow-read https://dreagonmon.github.io/web-launcher-devkit/scripts/dev.js
```
