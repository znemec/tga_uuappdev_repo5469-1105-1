"use strict";
const ItemAbl = require("../../abl/item-abl.js");

class ItemController {
  create(ucEnv) {
    return ItemAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return ItemAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  update(ucEnv) {
    return ItemAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  complete(ucEnv) {
    return ItemAbl.complete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  delete(ucEnv) {
    return ItemAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  list(ucEnv) {
    return ItemAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new ItemController();
