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
  if (!isoString) return " ";

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

export const formatDatesRelative = (dateString) => {
  if (!dateString) return null;

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date; // always positive: past dates
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatedDate = (timestamp) => {
  if (!timestamp) return "N/A";

  const now = new Date();
  const date = new Date(timestamp);
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Helper to format time (12-hour format)
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Helper to get day name
  const getDayName = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  // Less than 1 minute
  if (diffInMinutes < 1) {
    return "Just now";
  }

  // Less than 1 hour
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  // Less than 24 hours
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  // Today (after midnight)
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return formatTime(date);
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isYesterday) {
    return `Yesterday at ${formatTime(date)}`;
  }

  // Within last 7 days
  if (diffInDays < 7) {
    return `${getDayName(date)} at ${formatTime(date)}`;
  }

  // Older than 7 days
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day} at ${formatTime(date)}`;
};

// Example usage:
// formatDateRelative('2025-11-06T07:25:28.991Z')
// Output examples:
// - "Just now"
// - "5 minutes ago"
// - "20 hours ago"
// - "4:26 PM"
// - "Yesterday at 8:12 PM"
// - "Fri at 8:12 PM"
// - "Nov 1 at 3:45 PM"
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
export function convertToThirdDay(dateString) {
  const originalDate = new Date(dateString);
  const updatedDate = new Date(originalDate);
  updatedDate.setDate(3); // Set day to 3
  return updatedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
}

export function formatDateWithOrdinal(dateString) {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", { month: "long" }); // e.g., "June"

  // Get ordinal suffix
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return `${day}${getOrdinal(day)} ${month}`;
}
export function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getStatusLabel(status) {
  const statusMap = {
    in_progress: "In Progress",
    declined: "Declined",
    pending: "Pending",
    accepted: "Accepted",
    updated: "Updated",
    cancelled: "Cancelled",
    expired: "Expired",
  };

  return statusMap[status] || "Completed";
}

export const convertToBase64 = async (uri) => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:image/jpeg;base64,${base64}`;
};

export default getSpecializationTitles;
