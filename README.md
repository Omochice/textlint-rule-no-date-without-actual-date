[![npm test](https://github.com/Omochice/textlint-rule-no-date-without-actual-date/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Omochice/textlint-rule-no-date-without-actual-date/actions/workflows/ci.yml)

# textlint-rule-no-date-without-actual-date

[textlint](https://github.com/textlint/textlint) rule that disallow date without actual date.

Like:

```
今日確認予定
```

Sometime, `今日` is required to be `今日(<actual-date>)`.


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
                { "marker": "今日", "format": "DD/mm" },
                { "marker": "明日", "format": "DD/mm", "duration": { "days": 1 } },
                { "marker": "今週", "format": "DD/mm週", "convertToWeekStart": true }
            ]
        }
    }
}
```

The fields `lang` and `markers` are needed.

`lang` is used for `Intl.Segmenter`. (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter)

`markers` is used for calculate date by [`date-fns`](https://github.com/date-fns/date-fns). (see https://date-fns.org/v2.29.2/docs/format)

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

```console
$ npm run build
```

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester).

```console
$ npm test
```

## License

MIT
