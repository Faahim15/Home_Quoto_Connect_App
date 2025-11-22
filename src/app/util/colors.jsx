const serviceColors = {
  "TV repair and Installation": "bg-[#319FCA]",
  "AC Repair and Maintenance": "bg-[#FF6B6B]",
  "Plumbing Services": "bg-[#10B981]",
  "Electrical Repair": "bg-[#8B5CF6]",
};

//${item?.status === "In Progress" ? "text-[#1A73E8]" : item.status === "Completed" ? "text-[#00BFA5]" : "text-[#D32F2F]"}
export const statusColorMap = {
  pending: "#FBBF24",
  accepted: "#10B981",
  declined: "#EF4444",
  updated: "#3B82F6",
  cancelled: "#D32F2F",
  expired: "#6B7280",
  in_progress: "#1A73E8",
  completed: "#10B981",
};

export default serviceColors;
