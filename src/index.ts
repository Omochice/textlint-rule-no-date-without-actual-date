import type { TextlintRuleModule } from "@textlint/types";
import { add, format } from "date-fns";
import { isOption, Marker, MatchedText } from "./types";

const fix = (marker: string, rule: Marker): string => {
  const today = new Date();
  const delta = rule.convertToWeekStart ? Number(format(today, "i")) - 1 : 0;
  const targetDate = add(today, { days: -delta });
  const actualDate = format(add(targetDate, rule.duration ?? {}), rule.format);
  return `${marker}(${actualDate})`;
};

const detect = (
  text: string,
  locale: string,
  markers: Marker[],
): MatchedText | undefined => {
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
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

const reporter: TextlintRuleModule = (
  context,
  options: Record<string, unknown> = {},
) => {
  const { getSource, RuleError, Syntax, report, fixer, locator } = context;

  if (!isOption(options)) {
    throw new Error(
      [
        "Specified option is invalid format:",
        `${JSON.stringify(options, undefined, 2)}`,
      ].join("\n"),
    );
  }

  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      const matched = detect(text, options.lang, options.markers);
      if (matched) {
        report(
          node,
          new RuleError(`${matched.text} must has actual date within.`, {
            padding: locator.range([
              matched.index,
              matched.index + matched.text.length,
            ]),
            fix: fixer.replaceTextRange(
              [
                matched.index,
                matched.index + matched.text.length,
              ],
              fix(
                matched.text,
                options.markers.find((e) => e.str === matched.text) as Marker,
              ),
            ),
          }),
        );
      }
    },
  };
};

export default { linter: reporter, fixer: reporter };
