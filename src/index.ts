import type { TextlintRuleModule } from "@textlint/types";

const detect = (text: string): boolean => {
  const markers = [
    "本日",
    "今日",
    "明日",
    "昨日",
    "今月",
    "来月",
    "昨月",
    "先月",
    "今週",
    "来週",
    "先週",
    "来年",
    "今年",
    "去年",
  ];
  for (const marker of markers) {
    const re = new RegExp(`${marker}[^\(（].*[^\)）]`);
    if (re.test(text)) {
      return true;
    }
  }
  return false;
};

const reporter: TextlintRuleModule = (context) => {
  const { getSource, RuleError, Syntax, report } = context;

  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      if (detect(text)) {
        report(
          node,
          new RuleError(`${text} must has actual date within.`),
        );
      }
    },
    // [Syntax.ListItem](node) {
    //   const text = getSource(node);
    //   console.log(text)
    //   if (detect(text)) {
    //     report(
    //       node,
    //       new RuleError(`${text} must has actual date within.`),
    //     );
    //   }
    // },
  };
};

export default reporter;
