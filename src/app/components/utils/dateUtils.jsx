// utils/dateUtils.js
import moment from "moment";

export const formatDateForDisplay = (dateString) => {
  if (!dateString) return null;
  return moment(dateString, "YYYY-MM-DD").format("MMM D, YYYY");
};

export const formatDateFromAPI = (isoString) => {
  if (!isoString) return "";
  return moment(isoString).format("YYYY-MM-DD");
};
