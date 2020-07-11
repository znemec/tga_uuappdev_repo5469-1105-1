"use strict";
const UuTodoMainUseCaseError = require("./uu-todo-main-use-case-error");

const Create = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}list/create/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ListDaoCreateFailed: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoCreateFailed`;
      this.message = "Add list by list DAO create failed.";
    }
  }
};

const Get = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}list/get/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ListDoesNotExist: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  }
};

const Update = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}list/update/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ListDaoUpdateFailed: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}listDaoUpdateFailed`;
      this.message = "Update list by list DAO update failed.";
    }
  }
};

const Delete = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}list/delete/`,

  InvalidDtoIn: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ListNotEmpty: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listNotEmpty`;
      this.message = "The list contains items.";
    }
  },
  ItemDaoDeleteFailed: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemDaoDeleteFailed`;
      this.message = "Delete item by item DAO delete failed.";
    }
  },
  ListDaoDeleteFailed: class extends UuTodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listDaoDeleteFailed`;
      this.message = "Delete list by list DAO delete failed.";
    }
  }
};

const List = {
  UC_CODE: `${UuTodoMainUseCaseError.ERROR_PREFIX}list/list/`,

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
  Delete,
  List
};
