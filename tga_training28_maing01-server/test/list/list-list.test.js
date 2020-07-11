const { TestHelper } = require("uu_appg01_server-test");

const LIST_NAME = "bestToDoListInDaUniverse";
const LIST_CREATE = "list/create";
const LIST_LIST = "list/list";

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

describe("List list cmd", () => {
  test("HDS", async () => {
    await TestHelper.executePostCommand(LIST_CREATE, { name: "A" });
    await TestHelper.executePostCommand(LIST_CREATE, { name: "B" });
    await TestHelper.executePostCommand(LIST_CREATE, { name: "C" });

    let dtoOut = await TestHelper.executeGetCommand(LIST_LIST);

    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.pageInfo.total).toEqual(3);
    expect(dtoOut.pageInfo.pageIndex).toEqual(0);
    expect(dtoOut.pageInfo.pageSize).toEqual(1000);
    // by default, list is ordered by name in ascending order
    expect(dtoOut.itemList[0].name).toEqual("A");
    expect(dtoOut.itemList[1].name).toEqual("B");
    expect(dtoOut.itemList[2].name).toEqual("C");
    expect(dtoOut.uuAppErrorMap).toEqual({});
  });

  test("A1 - unsupported keys in dtoIn", async () => {
    await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });

    let dtoOut = await TestHelper.executeGetCommand(LIST_LIST, {
      blabla: "blabla"
    });
    expect(dtoOut.status).toEqual(200);
    let warning = dtoOut.uuAppErrorMap["uu-todo-main/list/list/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList).toEqual(["$.blabla"]);
  });

  test("A2 - dtoIn is not valid", async () => {
    expect.assertions(2);

    try {
      await TestHelper.executeGetCommand(LIST_LIST, { pageInfo: { pageIndex: "mrglgl" } });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/list/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });
});
