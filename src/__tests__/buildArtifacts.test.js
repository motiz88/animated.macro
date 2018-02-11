import macro from "../../";
import plugin from "../../";

describe("build artifacts", () => {
  test("macro is a function", () => {
    expect(macro).toBeInstanceOf(Function);
  });
  test("plugin is a function", () => {
    expect(plugin).toBeInstanceOf(Function);
  });
});
