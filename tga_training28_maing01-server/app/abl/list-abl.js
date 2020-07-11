"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");

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
  DeleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
  },
  ListUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  }
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item");
  }

  async create(awid, dtoIn) {
    // HDS 1.1
    let validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    // HDS 1.2, 1.3, A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.CreateUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // HDS 2.
    let dtoOut;
    try {
      dtoIn.awid = awid;
      dtoOut = await this.listDao.create(dtoIn);
    } catch (e) {
      // A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.ListDaoCreateFailed(uuAppErrorMap, e);
      }
      throw e;
    }
    // HDS 3.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async get(awid, dtoIn) {
    // HDS 1.1.
    let validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    // HDS 1.2, 1.3, A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.GetUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    // HDS 2.
    let dtoOut = await this.listDao.get(awid, dtoIn.id);
    // A3
    if (!dtoOut) {
      throw new Errors.Get.ListDoesNotExist(uuAppErrorMap);
    }
    // HDS 3.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn) {
    // HDS 1.1
    let validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
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
      let list = {
        awid: awid,
        id: dtoIn.list
      };
      if (dtoIn.name) {
        list.name = dtoIn.name;
      }
      dtoOut = await this.listDao.update(list);
    } catch (e) {
      // A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.ListDaoUpdateFailed(uuAppErrorMap, e);
      }
      throw e;
    }
    // HDS 3.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async delete(awid, dtoIn) {
    // HDS 1.1
    let validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
    // HDS 1.2, 1.3, A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.DeleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );
    // HDS 1.4
    if (dtoIn.forceDelete === undefined) {
      dtoIn.forceDelete = false;
    }
    // HDS 2.
    let items = await this.itemDao.listByListAndCompleted(awid, dtoIn.id);
    // HDS 2.1
    if (!dtoIn.forceDelete && items.itemList.length !== 0) {
      // A3
      throw new Errors.Delete.ListNotEmpty(uuAppErrorMap);
    }
    // HDS 2.2, 2.3
    if (dtoIn.forceDelete) {
      for (let item of items.itemList) {
        try {
          await this.itemDao.delete(awid, item.id);
        } catch (e) {
          // A4
          if (e instanceof ObjectStoreError) {
            throw new Errors.Delete.ItemDaoDeleteFailed(uuAppErrorMap, e);
          }
          throw e;
        }
      }
    }
    // HDS 3.
    let dtoOut = {};
    try {
      await this.listDao.delete(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A5
        throw new Errors.Delete.ListDaoDeleteFailed(uuAppErrorMap, e);
      }
      throw e;
    }
    // HDS 4.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn) {
    // HDS 1., 1.1.
    let validationResult = this.validator.validate("listListDtoInType", dtoIn);

    // HDS 1.2., 1.3., A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.ListUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 1.4.
    if (!dtoIn.pageInfo) {
      dtoIn.pageInfo = {};
    }
    if (!dtoIn.pageInfo.pageIndex) {
      dtoIn.pageInfo.pageIndex = 0;
    }
    if (!dtoIn.pageInfo.pageSize) {
      dtoIn.pageInfo.pageSize = 1000;
    }
    // HDS 2.
    let dtoOut = await this.listDao.list(awid, dtoIn.pageInfo);

    // HDS 3.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ListAbl();
