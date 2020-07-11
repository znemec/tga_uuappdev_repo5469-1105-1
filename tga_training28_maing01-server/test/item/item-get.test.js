const { TestHelper } = require("uu_appg01_server-test");

const LIST_NAME = "Zdennyho_list_No1";
const ITEM_TEXT = "Create MongoDB and Maria databases dump";
const LIST_CREATE = "list/create";
const ITEM_CREATE = "item/create";
const ITEM_GET = "item/get";
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

describe("Item get cmd", () => {
  test("HDS", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let createDtoOut = await TestHelper.executePostCommand(ITEM_CREATE, { list: listDtoOut.id, text: ITEM_TEXT });
    let dtoOut = await TestHelper.executeGetCommand(ITEM_GET, { id: createDtoOut.id });
    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.list).toEqual(createDtoOut.list);
    expect(dtoOut.text).toEqual(ITEM_TEXT);
    expect(dtoOut.completed).toEqual(createDtoOut.completed);
    expect(dtoOut.awid).toEqual(TestHelper.getAwid());
    expect(dtoOut.uuAppErrorMap).toEqual({});
  });

  test("A1 - unsupported keys in dtoIn", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let createDtoOut = await TestHelper.executePostCommand(ITEM_CREATE, { list: listDtoOut.id, text: ITEM_TEXT });
    let dtoOut = await TestHelper.executeGetCommand(ITEM_GET, { id: createDtoOut.id, blabla: "blabla" });
    expect(dtoOut.status).toEqual(200);
    let warning = dtoOut.uuAppErrorMap["uu-todo-main/item/get/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList).toEqual(["$.blabla"]);
  });

  test("A2 - dtoIn is not valid", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(ITEM_GET, {});
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/get/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("A3 - item does not exist", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(ITEM_GET, { id: SOME_ITEM_ID });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/get/itemDoesNotExist");
      expect(e.message).toEqual("Item with given id does not exist.");
    }
  });
});
