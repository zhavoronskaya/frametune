import assert from "node:assert";
import test, { describe } from "node:test";

import Volume from "./Volume.ts";

describe("Volume", async () => {
  test("Calculate nested volume values", () => {
    assert.strictEqual(Volume.calculate(1, 1, 1, 0.1), 0.1);
    assert.strictEqual(Volume.calculate(1, 1, 0.5, 0.1), 0.05);
    assert.strictEqual(Volume.calculate(0.5, 1, 1, 0.1), 0.05);
    assert.strictEqual(Volume.calculate(0.5, 1, 0.1, 0.5), 0.025);
    assert.strictEqual(Volume.calculate(0.5, 0, 0.1, 0.5), 0);
  });
});
