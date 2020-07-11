const { TestHelper } = require("uu_appg01_server-test");

const LIST_NAME = "Zdennyho_list_No1";
const ITEM_TEXT = "Create MongoDB and Maria databases dump";
const LIST_CREATE = "list/create";
const ITEM_CREATE = "item/create";
const SOME_ITEM_ID = "000000000000000000000000";

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

describe("Item create cmd", () => {
  test("HDS", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let dtoOut = await TestHelper.executePostCommand(ITEM_CREATE, { list: listDtoOut.id, text: ITEM_TEXT });
    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.list).toEqual(listDtoOut.id);
    expect(dtoOut.text).toEqual(ITEM_TEXT);
    expect(dtoOut.completed).toEqual(false);
    expect(dtoOut.awid).toEqual(TestHelper.getAwid());
    expect(dtoOut.uuAppErrorMap).toEqual({});
  });

  test("A1 - unsupported keys in dtoIn", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let dtoOut = await TestHelper.executePostCommand(ITEM_CREATE, {
      list: listDtoOut.id,
      text: ITEM_TEXT,
      blabla: "blabla"
    });
    expect(dtoOut.status).toEqual(200);
    let warning = dtoOut.uuAppErrorMap["uu-todo-main/item/create/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList).toEqual(["$.blabla"]);
  });

  test("A2 - dtoIn is not valid", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand(ITEM_CREATE, {});
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/create/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("A3 - list does not exist", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand(ITEM_CREATE, { list: SOME_ITEM_ID, text: ITEM_TEXT });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/create/listDoesNotExist");
      expect(e.message).toEqual("List with given id does not exist.");
    }
  });
});
