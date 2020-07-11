const { TestHelper } = require("uu_appg01_server-test");

const LIST_NAME = "Zdennyho_list_No1";
const ITEM_TEXT = "Create MongoDB and Maria databases dump";
const LIST_CREATE = "list/create";
const ITEM_CREATE = "item/create";
const ITEM_UPDATE = "item/update";

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

describe("Item update cmd", () => {
  test("HDS", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let dtoOutCreate = await TestHelper.executePostCommand(ITEM_CREATE, { list: listDtoOut.id, text: ITEM_TEXT });
    expect(dtoOutCreate.list).toEqual(listDtoOut.id);
    expect(dtoOutCreate.text).toEqual(ITEM_TEXT);
    expect(dtoOutCreate.completed).toEqual(false);
    let dtoOut = await TestHelper.executePostCommand(ITEM_UPDATE, { item: dtoOutCreate.id, text: "UPDATED_TEXT" });
    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.list).toEqual(dtoOutCreate.list);
    expect(dtoOut.text).toEqual("UPDATED_TEXT");
    expect(dtoOut.completed).toEqual(dtoOutCreate.completed);
    expect(dtoOut.awid).toEqual(TestHelper.getAwid());
    expect(dtoOut.uuAppErrorMap).toEqual({});
  });

  test("A1 - unsupported keys in dtoIn", async () => {
    let listDtoOut = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });
    let dtoOutCreate = await TestHelper.executePostCommand(ITEM_CREATE, { list: listDtoOut.id, text: ITEM_TEXT });
    let dtoOut = await TestHelper.executePostCommand(ITEM_UPDATE, { item: dtoOutCreate.id, blabla: "blabla" });
    expect(dtoOut.status).toEqual(200);
    let warning = dtoOut.uuAppErrorMap["uu-todo-main/item/update/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList).toEqual(["$.blabla"]);
  });

  test("A2 - dtoIn is not valid", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand(ITEM_UPDATE, {});
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/update/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });
});
