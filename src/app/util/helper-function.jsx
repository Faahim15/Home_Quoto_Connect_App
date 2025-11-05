import services from "../components/data/jobs/CategoryIds";
import { specializations } from "../components/data/jobs/CategoryIds";
// Helper functions

export const getServiceName = (serviceId) => {
  const foundService = services.find((service) => service.id === serviceId);
  return foundService ? foundService.name : "Electrician";
};

const getSpecializationTitles = (specIds) => {
  if (!Array.isArray(specIds)) return "No specializations selected";

  return specIds
    .map((id) => {
      const found = specializations.find((spec) => spec.id === id);
      return found ? found.title : id;
    })
    .join(", ");
};

export const formatTime = (date) => {
  if (!date) return "HH:MM";
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  const m = minutes < 10 ? `0${minutes}` : minutes;
  return `${h}:${m} ${ampm}`;
};

export function formatDateForCanada(isoString) {
  if (!isoString) return "Invalid date";

  const date = new Date(isoString);

  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long", // e.g., Friday
    year: "numeric", // e.g., 2025
    month: "long", // e.g., October
    day: "numeric", // e.g., 31
    timeZone: "America/Toronto", // 🇨🇦 Eastern Time
  }).format(date);
}
export default getSpecializationTitles;
