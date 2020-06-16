import { listenAndServe, ServerRequest, Response } from "https://deno.land/std@0.57.0/http/server.ts";
import { parse } from "https://deno.land/std@0.57.0/flags/mod.ts";

interface LauncherServerArgs {
  _: string[];
  // -p --port
  p: number;
  port: number;
}
interface ApplicationInfo {
  name: string;
  package: string;
  activity: string;
};
type ApplicationTheme = [string, string, string];
class Random{
  private seed: number;
  constructor(seed: number = Math.PI*Math.PI){
    this.seed = seed;
  };
  nextInt(min: number, max: number): number {
    let rand = Number.parseFloat("0."+Math.sin(this.seed ++).toString().substr(6));
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(rand * (max - min)) + min;
  };
}
const HEADER_CONTENT_TYPE_JSON = {"Content-type":"application/json"};
const HEADER_CONTENT_TYPE_PLAIN = {"Content-type":"text/plain"};
const HEADER_CONTENT_TYPE_SVG = {"Content-type":"image/svg+xml"};
const RSP_200 = (): Response => {
  return {status: 200, headers: new Headers(HEADER_CONTENT_TYPE_PLAIN), body: "200 OK"};
};
const RSP_404 = (): Response => {
  return {status: 404, headers: new Headers(HEADER_CONTENT_TYPE_PLAIN), body: "404 Not Found"};
};
const RSP_403 = (): Response => {
  return {status: 403, headers: new Headers(HEADER_CONTENT_TYPE_PLAIN), body: "403 Forbidden"};
}
const RSP_500 = (): Response => {
  return {status: 500, headers: new Headers(HEADER_CONTENT_TYPE_PLAIN), body: "500 Internal Server Error"};
};
const PERMISSION_NAME: Record<string, string> = {
  "launcher": "Launcher",
};
const ICON_SIZE: number = 128;
const WORD_LIST: Array<string> = [
  "otren", "nlttvwrarc", "fhoiaii", "eehednt", "xeomlea", "ennsheey", "msapeg", "etauwilash",
  "ytfi", "hosodad", "cemehn", "inra", "oeeow", "dubeto", "mauetehs", "deetrtre",
  "lelsiid", "nkghs", "admiat", "iadh", "hoyu", "mhyiiltaafm", "hrwjaw",
];
const COLOR_LIST: Array<string> = [
  "#f44336", "#e91e63", "#e91e63", "#7e57c2", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
  "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722",
  // "#795548", "#9e9e9e", "#9e9e9e",
];

const getParameterByName = (url: string, name: string): string|null => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
const getRandomWord = (random: Random): string => {
  let pos = random.nextInt(0, WORD_LIST.length);
  return WORD_LIST[pos];
}
const getRandomColor = (random: Random): string => {
  let pos = random.nextInt(0, COLOR_LIST.length);
  return COLOR_LIST[pos];
}
const toFirstUpperCase = (text: string): string => {
  return text.replace(/^./u, text.charAt(0).toUpperCase());
}
const generateRandomAppList = (seed: number = Math.PI*Math.PI, size: number = 50): [Array<ApplicationInfo>, Record<string, ApplicationTheme>] => {
  let apps: Array<ApplicationInfo> = [];
  let colors: Record<string, ApplicationTheme> = {};
  let r = new Random(seed);
  for (let i=0; i<size; i++){
    let length = r.nextInt(1, 4); // name word count [1, 4)
    let app: ApplicationInfo = {name: "", activity: "", package: ""};
    for (let k=0; k<length; k++){
      let word = getRandomWord(r);
      app.name += toFirstUpperCase(word) + " ";
      app.package += word + ".";
    }
    app.activity = app.package + "MainActivity";
    app.name = app.name.substr(0, app.name.length - 1);
    app.package = app.package.substr(0, app.package.length - 1);
    let theme: ApplicationTheme = [getRandomColor(r), getRandomColor(r), getRandomColor(r)];
    colors[app.package] = theme;
    apps.push(app);
  }
  return [apps, colors];
};

// server service
const [APP_LIST, APP_THEME] = generateRandomAppList();
const addCORSHeader = (requestHeaders: Headers, responseHeaders: Headers): void => {
  if (requestHeaders.has("Origin")){
    let origin: string = <string> requestHeaders.get("Origin");
    responseHeaders.append("Access-Control-Allow-Origin", origin);
  }
  if (requestHeaders.has("Access-Control-Request-Methods")){
    let accessMethod: string = <string> requestHeaders.get("Access-Control-Request-Methods");
    responseHeaders.append("Access-Control-Allow-Methods", accessMethod);
  }
  if (requestHeaders.has("Access-Control-Request-Headers")){
    let accessHeader: string = <string> requestHeaders.get("Access-Control-Request-Headers");
    responseHeaders.append("Access-Control-Allow-Headers", accessHeader);
  }
};

const doCORS = async (req: ServerRequest): Promise<Response> => {
  let headers = new Headers();
  return {status: 204, headers: headers, body: ""};
};

const doGetApplicationList = async (req: ServerRequest): Promise<Response> => {
  let rsp: Response = {status: 200};
  rsp.headers = new Headers(HEADER_CONTENT_TYPE_JSON);
  rsp.body = JSON.stringify(APP_LIST);
  return rsp;
};

const doGetApplicationIcon = async (req: ServerRequest): Promise<Response> => {
  let activityName = <string> getParameterByName(req.url, "activity");
  let packageName = getParameterByName(req.url, "package");
  let sizeText = getParameterByName(req.url, "size");
  let size = ICON_SIZE;
  if (sizeText != null){
    size = Number.parseInt(sizeText);
  }
  let theme: ApplicationTheme;
  if (packageName != null){
    theme = APP_THEME[packageName];
  }else{
    let r = new Random(Math.random()*Number.MAX_SAFE_INTEGER);
    theme = [getRandomColor(r), getRandomColor(r), getRandomColor(r)];
  }
  let SVG_IMAGE: string = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <g>
   <rect x="-1" y="-1" width="${size+2}" height="${size+2}" id="canvas_background" fill="none"/>
  </g>
  <g>
   <ellipse ry="${size/2.2}" rx="${size/2.2}" id="svg_3" cy="${size/2}" cx="${size/2}" stroke-width="0" stroke="#000" fill="${theme[0]}"/>
   <ellipse ry="${size/3}" rx="${size/3}" id="svg_3" cy="${size/2}" cx="${size/2}" stroke-width="0.5" stroke="#000" fill="${theme[1]}"/>
   <ellipse ry="${size/5}" rx="${size/5}" id="svg_3" cy="${size/2}" cx="${size/2}" stroke-width="0" stroke="#000" fill="${theme[2]}"/>
  </g>
  </svg>`;
  let rsp: Response = {status: 200};
  rsp.headers = new Headers(HEADER_CONTENT_TYPE_SVG);
  rsp.body = SVG_IMAGE;
  return rsp;
};

const doLaunchApplication = async (req: ServerRequest): Promise<Response> => {
  let packageName = <string> getParameterByName(req.url, "package");
  let activityName = <string> getParameterByName(req.url, "activity");
  console.log("[launcher] Launch_Application>", packageName, ":", activityName);
  return RSP_200();
};

const doRequestPermission = async (req: ServerRequest): Promise<Response> => {
  let name = <string> getParameterByName(req.url, "name");
  let displayName = PERMISSION_NAME[name];
  if (displayName == undefined){
    return RSP_403(); // no such permission
  }
  console.log("[launcher] Request_Permission>", displayName);
  return RSP_200();
};

const route = async (req: ServerRequest): Promise<Response> => {
  if (req.method.toUpperCase() == "OPTIONS"){
    return await doCORS(req);
  }
  let path = req.url.split("?")[0].split("/");
  // path[0] is empty
  if (path.length < 3 || path[1] != "api"){
    return  RSP_404();
  }
  try {
    switch (path[2]) {
      case "app-list-all":
        return await doGetApplicationList(req);
      case "icon":
        return await doGetApplicationIcon(req);
      case "launch":
        return await doLaunchApplication(req);
      case "request-permission":
        return await doRequestPermission(req);
    }
  }catch (err){
    return RSP_500();
  }
  return  RSP_404();
};

const handler = async (req: ServerRequest): Promise<void> => {
  let rsp = await route(req);
  addCORSHeader(req.headers, rsp.headers ? rsp.headers : new Headers());
  await req.respond(rsp);
};

// start dev server
const __serverArgs = parse(Deno.args) as LauncherServerArgs;
const __port = __serverArgs.port ?? __serverArgs.p ?? 10801;
console.log(`Launcher server listening on http://0.0.0.0:${__port}/`);
listenAndServe({ hostname: "0.0.0.0", port: __port }, handler);