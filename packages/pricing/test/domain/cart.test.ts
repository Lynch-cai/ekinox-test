import { describe, expect, it } from "vitest";
import { parseCart } from "../../src/domain/cart.ts";

describe("parseCart", () => {
  it("reads one title per line, skipping blank lines", () => {
    expect(parseCart("Back to the Future 1\n\nBack to the Future 2\n   \n")).toEqual([
      "Back to the Future 1",
      "Back to the Future 2",
    ]);
  });

  it("accepts Windows and Mac line endings", () => {
    expect(parseCart("A\r\nB\rC")).toEqual(["A", "B", "C"]);
  });
});
