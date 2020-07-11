"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");

const WARNINGS = {
  CreateUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  GetUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  UpdateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  CompleteUnsupportedKeys: {
    code: `${Errors.Complete.UC_CODE}unsupportedKeys`
  },
  DeleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
  },
  ListUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  }
};

class ItemAbl {
  constructor() {
    this.validator = Validator.load();
    this.itemDao = DaoFactory.getDao("item");
    this.listDao = DaoFactory.getDao("list");
  }

  async create(awid, dtoIn) {
    // HDS 1.1.
    let validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    // HDS 1.2, 1.3, A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.CreateUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // HDS 2.
    dtoIn.completed = false;
    // HDS 3., A3
    if (!(await this.listDao.get(awid, dtoIn.list))) {
      throw new Errors.Create.ListDoesNotExist(uuAppErrorMap);
    }
    // HDS 4.
    let dtoOut;
    try {
      dtoIn.awid = awid;
      dtoOut = await this.itemDao.create(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A.4
        throw new Errors.Create.ItemDaoCreateFailed(uuAppErrorMap, e);
      }
      throw e;
    }
    // HDS 5.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async get(awid, dtoIn) {
    // HDS 1.1
    let validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    // HDS 1.2, 1.3, A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.GetUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    // HDS 2.
    let dtoOut = await this.itemDao.get(awid, dtoIn.id);
    // A3
    if (!dtoOut) {
      throw new Errors.Get.ItemDoesNotExist(uuAppErrorMap);
    }
    // HDS 3.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn) {
    // HDS 1.1
    let validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
    // HDS 1.2, 1.3, A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.UpdateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );
    // HDS 2.
    let dtoOut;
    try {
      let item = {
        awid: awid,
        id: dtoIn.item
      };
      if (dtoIn.text) {
        item.text = dtoIn.text;
      }
      if (dtoIn.list) {
        item.list = dtoIn.list;
      }
      dtoOut = await this.itemDao.update(item);
    } catch (e) {
      // A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.ItemDaoUpdateFailed(uuAppErrorMap, e);
      }
      throw e;
    }
    // HDS 3.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async complete(awid, dtoIn) {
    // HDS 1.1
    let validationResult = this.validator.validate("itemCompleteDtoInType", dtoIn);
    // HDS 1.2, 1.3., A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.CompleteUnsupportedKeys.code,
      Errors.Complete.InvalidDtoIn
    );
    // HDS 1.4
    if (dtoIn.completed === undefined) {
      dtoIn.completed = true;
    }
    // HDS 2.
    let dtoOut;
    try {
      dtoOut = await this.itemDao.setCompleted(awid, dtoIn.item, dtoIn.completed);
    } catch (e) {
      // A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.Complete.ItemDaoSetCompletedFailed(uuAppErrorMap, e);
      }
      throw e;
    }
    // HDS 3.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async delete(awid, dtoIn) {
    // HDS 1.1
    let validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    // HDS 1.2, A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.DeleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );
    // HDS 2.
    let dtoOut = {};
    try {
      await this.itemDao.delete(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A4
        throw new Errors.Delete.ItemDaoDeleteFailed(uuAppErrorMap, e);
      }
      throw e;
    }
    // HDS 3.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn) {
    // HDS 1.1
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    // HDS 1.2, A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.ListUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    // HDS 2.
    let dtoOut;
    if (dtoIn.list && dtoIn.completed !== undefined) {
      // HDS 2.1.
      dtoOut = await this.itemDao.listByListAndCompleted(awid, dtoIn.list, dtoIn.completed, dtoIn.pageInfo);
    } else if (dtoIn.list) {
      // HDS 2.2.
      dtoOut = await this.itemDao.listByListAndCompleted(awid, dtoIn.list, undefined, dtoIn.pageInfo);
    } else if (dtoIn.completed !== undefined) {
      // HDS 2.3.
      dtoOut = await this.itemDao.listByListAndCompleted(awid, null, dtoIn.completed, dtoIn.pageInfo);
    } else {
      // HDS 2.4.
      dtoOut = await this.itemDao.list(awid, dtoIn.pageInfo);
    }
    // HDS 3.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ItemAbl();
