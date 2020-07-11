const { TestHelper } = require("uu_appg01_server-test");

const LIST_NAME = "Zdennyho_list_No1";
const LIST_CREATE = "list/create";
const ITEM_TEXT = "Create MongoDB and Maria databases dump";
const ITEM_CREATE = "item/create";
const LIST_DELETE = "list/delete";
const ITEM_GET = "item/get";
const LIST_GET = "list/get";

beforeAll(async () => {
  await TestHelper.setup();
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initApp();
  await TestHelper.initAppWorkspace();
  await TestHelper.login("AwidOwner");
});

describe("List delete cmd", () => {
  test("HDS", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let dtoOutCreate = await TestHelper.executePostCommand(ITEM_CREATE, { list: listDtoOut.id, text: ITEM_TEXT });
    let dtoOut = await TestHelper.executePostCommand(LIST_DELETE, { id: listDtoOut.id, forceDelete: true });
    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.uuAppErrorMap).toEqual({});
    try {
      await TestHelper.executeGetCommand(LIST_GET, { id: listDtoOut.id });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/get/listDoesNotExist");
      expect(e.message).toEqual("List with given id does not exist.");
    }
    try {
      await TestHelper.executeGetCommand(ITEM_GET, { id: dtoOutCreate.id });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/get/itemDoesNotExist");
      expect(e.message).toEqual("Item with given id does not exist.");
    }
  });

  test("A1 - unsupported keys in dtoIn", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let dtoOut = await TestHelper.executePostCommand(LIST_DELETE, { id: listDtoOut.id, blabla: "mrglgl" });
    expect(dtoOut.status).toEqual(200);
    let warning = dtoOut.uuAppErrorMap["uu-todo-main/list/delete/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList).toEqual(["$.blabla"]);
  });

  test("A2 - dtoIn is not valid", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand(LIST_DELETE, {});
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/delete/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("A3 - list not empty", async () => {
    expect.assertions(2);
    try {
      let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
      await TestHelper.executePostCommand(ITEM_CREATE, { list: listDtoOut.id, text: ITEM_TEXT });
      await TestHelper.executePostCommand(LIST_DELETE, { id: listDtoOut.id });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/delete/listNotEmpty");
      expect(e.message).toEqual("The list contains items.");
    }
  });
});
