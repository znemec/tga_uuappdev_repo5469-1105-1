const { TestHelper } = require("uu_appg01_server-test");

const LIST_NAME = "Zdennyho_list_No1";
const ITEM_TEXT = "Create MongoDB and Maria databases dump";
const LIST_CREATE = "list/create";
const ITEM_CREATE = "item/create";
const ITEM_GET = "item/get";
const ITEM_COMPLETE = "item/complete";

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

describe("Item complete cmd", () => {
  test("HDS", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let createDtoOut = await TestHelper.executePostCommand(ITEM_CREATE, { list: listDtoOut.id, text: ITEM_TEXT });
    let item = await TestHelper.executeGetCommand(ITEM_GET, { id: createDtoOut.id });
    let dtoOut = await TestHelper.executePostCommand(ITEM_COMPLETE, { item: createDtoOut.id, completed: true });
    expect(dtoOut.status).toEqual(200);
    expect(item.completed).toEqual(false);
    expect(dtoOut.completed).toEqual(true);
    expect(dtoOut.awid).toEqual(TestHelper.getAwid());
    expect(dtoOut.uuAppErrorMap).toEqual({});
  });

  test("A1 - unsupported keys in dtoIn", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let createDtoOut = await TestHelper.executePostCommand(ITEM_CREATE, { list: listDtoOut.id, text: ITEM_TEXT });
    let dtoOut = await TestHelper.executePostCommand(ITEM_COMPLETE, { item: createDtoOut.id, blabla: "blabla" });
    expect(dtoOut.status).toEqual(200);
    let warning = dtoOut.uuAppErrorMap["uu-todo-main/item/complete/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList).toEqual(["$.blabla"]);
  });

  test("A2 - dtoIn is not valid", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand(ITEM_COMPLETE, {});
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/complete/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });
});
