"use strict";
const UuTodoMainUseCaseError = require("./uu-todo-main-use-case-error");

const Create = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}item/create/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ListDoesNotExist: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },
  ItemDaoCreateFailed: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemDaoCreateFailed`;
      this.message = "Add item by item DAO create failed.";
    }
  }
};

const Get = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}item/get/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDoesNotExist: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  }
};

const Update = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}item/update/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDaoUpdateFailed: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDaoUpdateFailed`;
      this.message = "Update item by item DAO update failed.";
    }
  }
};

const Complete = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}item/complete/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Complete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDaoSetCompletedFailed: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Complete.UC_CODE}itemDaoSetCompletedFailed`;
      this.message = "Update item by item DAO setCompleted failed.";
    }
  }
};

const Delete = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}item/delete/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDaoDeleteFailed: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemDaoDeleteFailed`;
      this.message = "Delete item by item DAO delete failed.";
    }
  }
};

const List = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}item/list/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

module.exports = {
  Create,
  Get,
  Update,
  Complete,
  Delete,
  List
};
