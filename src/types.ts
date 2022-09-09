import { Duration } from "date-fns";
import { isArray, isBoolean, isNumber, isObject, isString } from "unknownutil";

export type Marker = {
  str: string;
  format: string;
  duration?: Duration;
  convertToWeekStart?: boolean;
};

export type MatchedText = {
  index: { start: number; end: number };
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
    isMaybe(x.duration, isDuration) &&
    isMaybe(x.convertToWeekStart, isBoolean);
}

export function isDuration(x: unknown): x is Duration {
  if (!isObject(x)) {
    return false;
  }
  return [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
  ].some((e) => isNumber(x[e]));
}

export function isMaybe(x: unknown, f: (y: unknown) => boolean): boolean {
  return x === undefined || f(x);
}
