import { ok } from "assert";
import * as types from "../src/types";
import { isArray, isBoolean, isNumber, isObject, isString } from "unknownutil";

const ng = (x: unknown) => {
  ok(!x);
};

const samples: {
  sample: unknown;
  func: (x: unknown) => boolean;
  description: string;
}[] = [
  { sample: "", func: isString, description: "string" },
  { sample: 42, func: isNumber, description: "number" },
  { sample: {}, func: isObject, description: "object" },
  { sample: [], func: isArray, description: "array" },
  { sample: true, func: isBoolean, description: "boolean" },
];

describe("Test for `isMaybe`", () => {
  for (const sample of samples) {
    it(`If x is unknown, isMaybe(x, ${sample.func.name}) should be passed`, () => {
      ok(types.isMaybe(undefined, sample.func));
    });
  }
});

describe("Test for `isDuration`", () => {
  describe("If x is not object, should be failed", () => {
    for (const sample of samples.filter((e) => e.description !== "object")) {
      it(`The case of ${sample.description}`, () => {
        ng(types.isDuration(sample.sample));
      });
    }
  });
  it("If x is empty object, isDuration should be failed", () => {
    ng(types.isDuration({}));
  });
  describe("If x has expected key as number, should be passed", () => {
    const keys = [
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
    ];
    for (const k of keys) {
      it(`The case of ${k}`, () => {
        ok(types.isDuration({ [k]: 42 }));
      });
    }
  });
});

describe("Test for isMarker", () => {
  describe("If x is not object, should be failed", () => {
    for (const sample of samples.filter((e) => e.description !== "object")) {
      it(`The case of ${sample.description}`, () => {
        ng(types.isMarker(sample.sample));
      });
    }
  });
  describe("If needed property is not found, should be failed", () => {
    for (const sample of ["str", "format"]) {
      it(`The case that ${sample} is missing`, () => {
        const x: Record<string, unknown> = { str: "", format: "" };
        x[sample] = undefined;
        ng(types.isMarker(x));
      });
    }
  });
  describe("The x can have 'duration' and 'convertToWeekStart'", () => {
    const x: Record<string, unknown> = { str: "", format: "" };
    it("If duration is `Duration`, should be passed", () => {
      x["duration"] = { "years": 0 };
      ok(types.isMarker(x));
    });
    it("If convertToWeekStart is boolean, should be passed", () => {
      x["convertToWeekStart"] = true;
      ok(types.isMarker(x));
    });
    it("But duration is not `Duration`, should be failed", () => {
      ng(
        samples.filter((e) => e.description !== "object").every((e) =>
          types.isMarker({ ...x, duration: e.sample })
        ),
      );
    });
    it("But convertToWeekStart is not boolean, should be failed", () => {
      ng(
        samples.filter((e) => e.description !== "boolean").every((e) =>
          types.isMarker({ ...x, convertToWeekStart: e.sample })
        ),
      );
    });
  });
});

describe("Test for `isOption`", () => {
  describe("If x is not object, should be failed", () => {
    for (const sample of samples) {
      it(`The case of ${sample.description}`, () => {
        ng(types.isOption(sample.sample));
      });
    }
  });
  const x: Record<string, unknown> = {
    lang: "sample",
    markers: [{ str: "", format: "" }],
  };
  describe("If x.lang is not string, should be failed", () => {
    for (const sample of samples.filter((e) => e.description !== "string")) {
      it(`The case of ${sample.description}`, () => {
        x.lang = sample.sample;
        ng(types.isOption(x));
      });
    }
  });
  describe("If x.markers is not array, should be failed", () => {
    for (const sample of samples.filter((e) => e.description !== "array")) {
      it(`The case of ${sample.description}`, () => {
        x.markers = sample.sample;
        ng(types.isOption(x));
      });
    }
  });
});
