import TextLintTester from "textlint-tester";
import rule from "../src/index";
const tester = new TextLintTester();

tester.run("If text is expected format, should pass", rule, {
  valid: [{
    text: "今日(09/09)対応予定",
    options: { lang: "ja", markers: [{ str: "今日", format: "MM/dd" }] },
  }],
});
