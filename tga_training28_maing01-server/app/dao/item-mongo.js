"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, list: 1, completed: 1 }, { unique: false });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async update(uuObject) {
    let filter = { awid: uuObject.awid, id: uuObject.id };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async setCompleted(awid, id, completed) {
    return await super.findOneAndUpdate({ awid, id }, { completed: completed }, "NONE");
  }

  async delete(awid, id) {
    return await super.deleteOne({ awid, id });
  }

  async list(awid, pageInfo = {}) {
    return await super.find({ awid, pageInfo });
  }

  async listByListAndCompleted(awid, list, completed, pageInfo = { pageIndex: 0, pageSize: 1000 }) {
    let filter = { awid };
    if (list) filter.list = list;
    if (completed !== undefined) filter.completed = completed;
    return await super.find(filter, pageInfo);
  }
}

module.exports = ItemMongo;
