import Vue from "vue";

import {
  format,
  formatDistanceToNowStrict,
  isThisYear,
  parseISO,
} from "date-fns";

Vue.filter("dateTime", (date: string) => {
  const isoDate = parseISO(date);
  return format(isoDate, "dd.MM.yyyy hh:mm");
});

Vue.filter("postDate", (date: string) => {
  const isoDate = parseISO(date);
  return format(isoDate, isThisYear(isoDate) ? "dd MMM" : "dd MMM ''yy");
});

Vue.filter("postDateDistance", (date: string) => {
  return formatDistanceToNowStrict(parseISO(date), {
    addSuffix: true,
  });
});
