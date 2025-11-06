import services from "../components/data/jobs/CategoryIds";
import { specializations } from "../components/data/jobs/CategoryIds";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export function formatDateRelative(isoString) {
  if (!isoString) return "Invalid date";

  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export async function getToken() {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token !== null) {
      console.log("Token:", token);
      return token;
    } else {
      console.log("No token found");
      return null;
    }
  } catch (error) {
    console.error("Error reading token from AsyncStorage", error);
    return null;
  }
}

export default getSpecializationTitles;
