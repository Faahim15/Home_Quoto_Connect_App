const CANADIAN_PROVINCES = [
  { id: "AB", name: "Alberta" },
  { id: "BC", name: "British Columbia" },
  { id: "MB", name: "Manitoba" },
  { id: "NB", name: "New Brunswick" },
  { id: "NL", name: "Newfoundland and Labrador" },
  { id: "NS", name: "Nova Scotia" },
  { id: "ON", name: "Ontario" },
  { id: "PE", name: "Prince Edward Island" },
  { id: "QC", name: "Quebec" },
  { id: "SK", name: "Saskatchewan" },
  { id: "NT", name: "Northwest Territories" },
  { id: "NU", name: "Nunavut" },
  { id: "YT", name: "Yukon" },
];
export const convertTo24Hour = (date) => {
  if (!date) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatTime = (date) => {
  if (!date) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const experienceOptions = [
  "Beginner (0-1 years)",
  "Intermediate (2-3 years)",
  "Advanced (4-5 years)",
  "Expert (6+ years)",
];
export default CANADIAN_PROVINCES;
