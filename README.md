[![Checks for push](https://github.com/Omochice/textlint-rule-no-date-without-actual-date/actions/workflows/check.yaml/badge.svg)](https://github.com/Omochice/textlint-rule-no-date-without-actual-date/actions/workflows/check.yaml)
[![npm version](https://flat.badgen.net/npm/v/textlint-rule-no-date-without-actual-date?color=yellow)](https://npmx.dev/package/textlint-rule-no-date-without-actual-date)

# textlint-rule-no-date-without-actual-date

[textlint](https://github.com/textlint/textlint) rule that disallow date without actual date.

Like:

```
今日確認予定
```

Sometime, `今日` is required to be `今日(<actual-date>)`.


## Requirements

This package is published as an ES module, so it needs a textlint that loads rule modules with dynamic `import()`.
textlint does so as of v13, and the supported major versions are declared in `peerDependencies`.
Older textlint loads rules with `require()`, which only works on Node.js versions that allow `require()` of an ES module.

## Install

Install with [npm](https://www.npmjs.com/):

```console
$ npm install textlint-rule-no-date-without-actual-date
```

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "no-date-without-actual-date": {
            "lang": "ja",
            "markers": [
                { "str": "今日", "format": "MM/dd" },
                { "str": "明日", "format": "MM/dd", "duration": { "days": 1 } },
                { "str": "今週", "format": "MM/dd週", "convertToWeekStart": true }
            ]
        }
    }
}
```

The fields `lang` and `markers` are needed.

`lang` is used for `Intl.Segmenter`. (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter)

`markers` is used for calculate date by [`date-fns`](https://github.com/date-fns/date-fns). (see https://date-fns.org/docs/format)

## License

MIT
