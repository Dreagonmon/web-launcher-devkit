"use strict";
class ApplicationInfo {
  name = "";
  package = "";
  activity = "";
}
class LauncherResponseError extends Error {
  constructor(msg) {
    super("LauncherResponseError: " + msg);
  }
}
const getParameterByName = (url, name) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
class Launcher {
  PERMISSION_LAUNCHER = "launcher";
  constructor(port = -1) {
    if (port < 0) {
      // try to get the port
      try {
        let url = window.location.href;
        let portText = getParameterByName(url, "port");
        port = Number.parseInt(portText);
        if (portText == null || port < 0) {
          port = 10801;
        }
      } catch{
        console.log("error, default port!", port);
        port = 10801;
      }
      console.log("using port:", port);
    }
    let protocol = window.location.protocol;
    if (protocol != "http:"){
      protocol = "https:"
    }
    this.port = port;
    this.address = `${protocol}//127.0.0.1:${port}/api/`;
  }
  getApplicationList = async () => {
    let url = `${this.address}app-list-all?t=${new Date().getTime()}`;
    let resp = await fetch(url);
    if (resp.status != 200) {
      return Promise.reject(new LauncherResponseError("status code not 200!"));
    }
    let arrays = JSON.parse(await resp.text());
    let appList = arrays.map(item => {
      let app = new ApplicationInfo();
      app.name = item.name;
      app.package = item.package;
      app.activity = item.activity;
      return app;
    });
    return appList;
  }
  getApplicationIconSrc = (packageName, activity, size = 128) => {
    return `${this.address}icon?package=${packageName}&activity=${activity}&size=${size}&t=${new Date().getTime()}`;
  }
  launchApplication = async (packageName, activity) => {
    let url = `${this.address}launch?package=${packageName}&activity=${activity}&t=${new Date().getTime()}`;
    let resp = await fetch(url);
    if (resp.status != 200) {
      return Promise.reject(new LauncherResponseError("status code not 200!"));
    }
    return true;
  }
  requestPermission = async (name) => {
    let url = `${this.address}request-permission?name=${name}&t=${new Date().getTime()}`;
    let resp = await fetch(url);
    if (resp.status != 200) {
      return Promise.reject(new LauncherResponseError("status code not 200!"));
    }
    return true
  }
};
// window['Launcher'] = Launcher;
// window['ApplicationInfo'] = ApplicationInfo;
// window['LauncherResponseError'] = LauncherResponseError;
export { Launcher, ApplicationInfo, LauncherResponseError };