import type { TextlintRuleModule } from "@textlint/types";
import { add, format } from "date-fns";
import { Marker, MatchedText } from "./types";

// TODO: load markers from other source
const markers: Marker[] = [
  { str: "本日", format: "MM/dd" },
  { str: "今日", format: "MM/dd" },
  { str: "明日", format: "MM/dd", duration: { days: 1 } },
  { str: "昨日", format: "MM/dd", duration: { days: -1 } },
  { str: "今月", format: "M月" },
  { str: "来月", format: "M月", duration: { months: 1 } },
  { str: "昨月", format: "M月", duration: { months: -1 } },
  { str: "先月", format: "M月", duration: { months: -1 } },
  { str: "今週", format: "MM/dd週", convertToWeekStart: true },
  {
    str: "来週",
    format: "MM/dd週",
    convertToWeekStart: true,
    duration: { weeks: 1 },
  },
  {
    str: "先週",
    format: "MM/dd週",
    convertToWeekStart: true,
    duration: { weeks: -1 },
  },
  { str: "今年", format: "YYYY年" },
  { str: "来年", format: "YYYY年", duration: { years: 1 } },
  { str: "去年", format: "YYYY年", duration: { years: -1 } },
];

const fix = (marker: string): string => {
  const rule = markers.find((e) => e.str === marker);
  if (rule === undefined) {
    throw new Error("???????");
  }
  const today = new Date();
  const delta = rule.convertToWeekStart ? Number(format(today, "i")) - 1 : 0;
  const targetDate = add(today, { days: -delta });
  const actualDate = format(add(targetDate, rule.duration ?? {}), rule.format);
  return `${marker}(${actualDate})`;
};

const detect = (text: string): MatchedText | undefined => {
  const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
  for (const marker of markers) {
    const re = new RegExp(`(${marker.str})[^\(（].*[^\)）]`);
    const matched = re.exec(text);
    if (matched) {
      for (const s of segmenter.segment(text)) {
        if (s.segment === marker.str) {
          return { text: s.segment, index: s.index };
        }
      }
    }
  }
  return undefined;
};

const reporter: TextlintRuleModule = (context) => {
  const { getSource, RuleError, Syntax, report, fixer, locator } = context;

  return {
    async [Syntax.Str](node) {
      const text = getSource(node);
      const matched = detect(text);
      if (matched) {
        report(
          node,
          new RuleError(`${matched.text} must has actual date within.`, {
            padding: locator.range([
              matched.index,
              matched.index + matched.text.length,
            ]),
            fix: fixer.replaceTextRange([
              matched.index,
              matched.index + matched.text.length,
            ], fix(matched.text)),
          }),
        );
      }
    },
  };
};

export default { linter: reporter, fixer: reporter };
