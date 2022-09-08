import TextLintTester from "textlint-tester";
import rule from "../src/index";
const tester = new TextLintTester();

tester.run("If no text is checked, should pass", rule, {
  valid: [{
    text: "",
    options: { lang: "ja", markers: [] },
  }],
});

tester.run("If text is normal, should pass", rule, {
  valid: [{
    text: "吾輩は猫である。名前はまだない。",
    options: { lang: "ja", markers: [{ str: "今日", format: "MM/dd" }] },
  }],
});

tester.run("If text is bracketed with harf-width bracket, should pass", rule, {
  valid: [{
    text: "今日(09/09)対応予定",
    options: { lang: "ja", markers: [{ str: "今日", format: "MM/dd" }] },
  }],
});

tester.run("If text is bracketed with full-width bracket, should pass", rule, {
  valid: [{
    text: "今日(09/09)対応予定",
    options: { lang: "ja", markers: [{ str: "今日", format: "MM/dd" }] },
  }],
});

tester.run("If text is unmatched with rule, should pass", rule, {
  valid: [{
    text: "今日対応予定",
    options: { lang: "ja", markers: [{ str: "明日", format: "MM/dd" }] },
  }],
});

tester.run("If text is matched but it is not date text, should pass", rule, {
  valid: [{
    text: "今日子さん",
    options: { lang: "ja", markers: [{ str: "今日", format: "MM/dd" }] },
  }],
});
