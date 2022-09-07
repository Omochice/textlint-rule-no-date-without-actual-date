import { Duration } from "date-fns";

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
