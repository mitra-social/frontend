import Vue from "vue";

import {
  format,
  parseISO,
  isThisYear,
  formatDistanceToNowStrict,
} from "date-fns";

Vue.filter("postDate", (date: string) => {
  const isoDate = parseISO(date);
  return format(isoDate, isThisYear(isoDate) ? "MMM dd" : "MMM dd ''yy");
});

Vue.filter("dateTime", (date: string) => {
  const isoDate = parseISO(date);
  return format(isoDate, "MM.dd.yyyy hh:mm");
});

Vue.filter("postDateDistance", (date: string) => {
  return formatDistanceToNowStrict(parseISO(date), {
    addSuffix: true,
  });
});
