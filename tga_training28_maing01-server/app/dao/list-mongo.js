"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async update(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, id: uuObject.id }, uuObject, "NONE");
  }

  async delete(awid, id) {
    return await super.deleteOne({ awid, id });
  }

  async list(awid, pageInfo = {}) {
    return await super.find({ awid }, pageInfo);
  }
}

module.exports = ListMongo;
