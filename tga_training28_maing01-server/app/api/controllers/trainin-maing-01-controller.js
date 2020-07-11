"use strict";
const TraininMaing01Abl = require("../../abl/trainin-maing01-abl.js");

class TraininMaing01Controller {
  init(ucEnv) {
    return TraininMaing01Abl.init(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new TraininMaing01Controller();
