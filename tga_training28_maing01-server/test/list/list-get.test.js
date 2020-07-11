const { TestHelper } = require("uu_appg01_server-test");

const LIST_NAME = "Zdennyho_list_No1";
const LIST_CREATE = "list/create";
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

describe("List get cmd", () => {
  test("HDS", async () => {
    let dtoOutCreate = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });

    let dtoOut = await TestHelper.executeGetCommand(LIST_GET, { id: dtoOutCreate.id });
    expect(dtoOut.status).toEqual(200);
    expect(dtoOut.name).toEqual(LIST_NAME);
    expect(dtoOut.awid).toEqual(TestHelper.getAwid());
    expect(dtoOut.uuAppErrorMap).toEqual({});
  });

  test("A1 - unsupported keys in dtoIn", async () => {
    let dtoOutCreate = await TestHelper.executePostCommand(LIST_CREATE, { name: LIST_NAME });

    let dtoOut = await TestHelper.executeGetCommand(LIST_GET, {
      id: dtoOutCreate.id,
      blabla: "blabla"
    });
    expect(dtoOut.status).toEqual(200);
    let warning = dtoOut.uuAppErrorMap["uu-todo-main/list/get/unsupportedKeys"];
    expect(warning).toBeTruthy();
    expect(warning.type).toEqual("warning");
    expect(warning.message).toEqual("DtoIn contains unsupported keys.");
    expect(warning.paramMap.unsupportedKeyList).toEqual(["$.blabla"]);
  });

  test("A2 - dtoIn is not valid", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(LIST_GET, {});
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/get/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("A3 - list get fails", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(LIST_GET, { id: "000000000000000000000000" });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/get/listDoesNotExist");
      expect(e.message).toEqual("List with given id does not exist.");
    }
  });
});
