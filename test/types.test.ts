import { ok } from "node:assert";
import { isOption } from "../src/types";

describe("test about isOption", () => {
  it("should return true if it receive valid option schema", () => {
    const option = {
      lang: "ja",
      markers: [
        { str: "今日", format: "MM/dd" },
        { str: "明日", format: "MM/dd", duration: { days: 1 } },
        { str: "今週", format: "MM/dd週", convertToWeekStart: true },
      ],
    };
    ok(isOption(option));
  });

  it("should return false if it receive invalid option schema", () => {
    const option = {
      language: "ja",
      marker: [],
    };
    ok(!isOption(option));
  });
});
