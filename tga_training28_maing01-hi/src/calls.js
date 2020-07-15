/**
 * Server calls of application client.
 */
import { Uri, AppClient } from "uu_appg01_core";
import * as UU5 from "uu5g04";
import Plus4U5 from "uu_plus4u5g01";

let Calls = {
  /** URL containing app base, e.g. "https://uuos9.plus4u.net/vnd-app/awid/". */
  APP_BASE_URI: location.protocol + "//" + location.host + UU5.Environment.getAppBasePath(),

  call(method, url, dtoIn, clientOptions) {
    return Plus4U5.Common.Calls.call(method, url, dtoIn, clientOptions);
  },

  loadDemoContent(dtoIn) {
    let commandUri = Calls.getCommandUri("loadDemoContent");
    return Calls.call("get", commandUri, dtoIn);
  },

  /*
  For calling command on specific server, in case of developing client site with already deployed
  server in uuCloud etc. You can specify url of this application (or part of url) in development
  configuration in *-client/env/development.json, for example:
   {
     ...
     "uu5Environment": {
       "gatewayUri": "https://uuos9.plus4u.net",
       "tid": "84723877990072695",
       "awid": "b9164294f78e4cd51590010882445ae5",
       "vendor": "uu",
       "app": "demoappg01",
       "subApp": "main"
     }
   }
   */

  listList(dtoInData) {
    return new Promise((resolve, reject) => {
      Plus4U5.Common.Calls.call("get", Calls.APP_BASE_URI + "list/list", {
        data: dtoInData,
        done: dtoOut =>
          resolve({
            itemList: dtoOut.itemList,
            pageInfo: dtoOut.pageInfo
          }),
        fail: response => reject(response)
      });
    });
  },

  updateList(id, data) {
    data.list = id;
    return AppClient.AppClient.post(Calls.APP_BASE_URI + "list/update", data);
  },

  updateItem(id, data) {
    data.item = id;
    return AppClient.AppClient.post(Calls.APP_BASE_URI + "item/update", data);
  },

  completeItem(id, data) {
    data.item = id;
    return AppClient.AppClient.post(Calls.APP_BASE_URI + "item/complete", data);
  },

  deleteList(data) {
    data.forceDelete = true;
    return AppClient.AppClient.post(Calls.APP_BASE_URI + "list/delete", data);
  },

  deleteItem(data) {
    return AppClient.AppClient.post(Calls.APP_BASE_URI + "item/delete", data);
  },

  createList(data) {
    return AppClient.AppClient.post(Calls.APP_BASE_URI + "list/create", data);
  },

  async listItem(dtoInData) {
    return new Promise((resolve, reject) => {
      Plus4U5.Common.Calls.call("get", Calls.APP_BASE_URI + "item/list", {
        data: dtoInData,
        done: dtoOut =>
          resolve({
            itemList: dtoOut.itemList,
            pageInfo: dtoOut.pageInfo
          }),
        fail: response => reject(response)
      });
    });
  },

  createItem(data) {
    return AppClient.AppClient.post(Calls.APP_BASE_URI + "item/create", data);
  },

  /*
  For calling command on specific server, in case of developing client site with already deployed
  server in uuCloud etc. You can specify url of this application (or part of url) in development
  configuration in *-client/env/development.json
  for example:
   {
     "gatewayUri": "https://uuos9.plus4u.net",
     "tid": "84723877990072695",
     "awid": "b9164294f78e4cd51590010882445ae5",
     "vendor": "uu",
     "app": "demoappg01",
     "subApp": "main"
   }
   */
  getCommandUri(aUseCase) {
    // useCase <=> e.g. "getSomething" or "sys/getSomething"
    // add useCase to the application base URI
    // NOTE Using string concatenation instead of UriBuilder to support also URLs
    // that don't conform to uuUri specification.
    let targetUriStr = Calls.APP_BASE_URI + aUseCase.replace(/^\/+/, "");

    // override tid / awid if it's present in environment (use also its gateway in such case)
    let env = UU5.Environment;
    if (env.tid || env.awid || env.vendor || env.app) {
      let uriBuilder = Uri.UriBuilder.parse(targetUriStr);
      if (env.tid || env.awid) {
        if (env.gatewayUri) uriBuilder.setGateway(env.gatewayUri);
        if (env.tid) uriBuilder.setTid(env.tid);
        if (env.awid) uriBuilder.setAwid(env.awid);
      }
      if (env.vendor || env.app) {
        if (env.vendor) uriBuilder.setVendor(env.vendor);
        if (env.app) uriBuilder.setApp(env.app);
        if (env.subApp) uriBuilder.setSubApp(env.subApp);
      }
      targetUriStr = uriBuilder.toUri().toString();
    }

    return targetUriStr;
  }
};

function isIE() {
  return !!window.MSInputMethodContext && !!document.documentMode;
}

export default Calls;
