import { Duration } from "date-fns";
import { isArray, isBoolean, isNumber, isObject, isString } from "unknownutil";

export type Marker = {
  str: string;
  format: string;
  duration?: Duration;
  convertToWeekStart?: boolean;
};

export type MatchedText = {
  index: number;
  text: string;
};

export type Option = {
  markers: Marker[];
  lang: string;
};

export function isOption(x: unknown): x is Option {
  return isObject(x) &&
    isString(x.lang) &&
    isArray(x.markers, isMarker);
}

export function isMarker(x: unknown): x is Marker {
  return isObject(x) &&
    isString(x.str) &&
    isString(x.format) &&
    maybe(x.duration, isDuration) &&
    maybe(x.convertToWeekStart, isBoolean);
}

export function isDuration(x: unknown): x is Duration {
  if (!isObject(x)) {
    return false;
  }
  for (
    const e of [
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
    ]
  ) {
    if (isNumber(x[e])) {
      return true;
    }
  }
  return false;
}

function maybe(x: unknown, f: Function): boolean {
  return x === undefined || f(x);
}
