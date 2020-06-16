# web-launcher-devkit
some [deno](https://deno.land/) scripts that can be used to develop Android Launcher

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

## visit example page

Start dev server and file server.

Then visit ```http://127.0.0.1:1080/examples/simple/index.html```

(make sure you are using default port)

## why Deno?

Because there is no "npm install" any more, you can run it without leaving any footprint in your project directory.