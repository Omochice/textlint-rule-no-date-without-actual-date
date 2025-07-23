import type { Duration } from "date-fns";
import { is, type Predicate } from "unknownutil";

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

const isMarker = is.ObjectOf({
  str: is.String,
  format: is.String,
  duration: is.OptionalOf(
    is.ObjectOf({
      years: is.OptionalOf(is.Number),
      months: is.OptionalOf(is.Number),
      weeks: is.OptionalOf(is.Number),
      days: is.OptionalOf(is.Number),
      hours: is.OptionalOf(is.Number),
      minutes: is.OptionalOf(is.Number),
      seconds: is.OptionalOf(is.Number),
    }),
  ),
  convertToWeekStart: is.OptionalOf(is.Boolean),
}) satisfies Predicate<Marker>;

export const isOption = is.ObjectOf({
  lang: is.String,
  markers: is.ArrayOf(isMarker),
}) satisfies Predicate<Option>;
