import type { TextlintRuleModule } from "@textlint/types";
import { add, format } from "date-fns";
import { Marker, MatchedText, isOption } from "./types";

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
): MatchedText[] => {
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  const matches: MatchedText[] = [];
  if (markers.some((m) => RegExp(`(${m.str})[^\(（].*[^\)）]`).test(text))) {
    for (const s of segmenter.segment(text)) {
      if (markers.some((m) => s.segment === m.str)) {
        matches.push({
          text: s.segment,
          index: {
            start: s.index,
            end: s.index + s.segment.length,
          },
        });
      }
    }
  }
  return matches;
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
      const matches = detect(text, options.lang, options.markers);
      for (const matched of matches) {
        report(
          node,
          new RuleError(`${matched.text} must has actual date within.`, {
            padding: locator.range([matched.index.start, matched.index.end]),
            fix: fixer.replaceTextRange(
              [matched.index.start, matched.index.end],
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
