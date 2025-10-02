export const periodOptions = [
  { id: "1", label: "Today", bookings: 12 },
  { id: "2", label: "This week", bookings: 45 },
  { id: "3", label: "This month", bookings: 128 },
  { id: "4", label: "Last month", bookings: 156 },
  { id: "5", label: "This year", bookings: 1247 },
  { id: "6", label: "All time", bookings: 3542 },
];
const earningsOptions = [
  { id: "1", label: "Today", bookings: 12300 },
  { id: "2", label: "This week", bookings: 4500000 },
  { id: "3", label: "This month", bookings: 8550000 },
  { id: "4", label: "Last month", bookings: 10550000 },
  { id: "5", label: "This year", bookings: 15550000 },
  { id: "6", label: "All time", bookings: 1079550000 },
];
export const chartData = {
  "This Week": [
    { value: 12, label: "Mon", dataPointColor: "white" },
    { value: 16, label: "Tue", dataPointColor: "white" },
    { value: 18, label: "Wed", dataPointColor: "white" },
    { value: 21, label: "Thu", dataPointColor: "white" },
    { value: 28, label: "Fri", dataPointColor: "white" },
    { value: 25, label: "Sat", dataPointColor: "white" },
    { value: 22, label: "Sun", dataPointColor: "white" },
  ],
  "Last Week": [
    { value: 10, label: "Mon", dataPointColor: "white" },
    { value: 14, label: "Tue", dataPointColor: "white" },
    { value: 16, label: "Wed", dataPointColor: "white" },
    { value: 19, label: "Thu", dataPointColor: "white" },
    { value: 23, label: "Fri", dataPointColor: "white" },
    { value: 20, label: "Sat", dataPointColor: "white" },
    { value: 18, label: "Sun", dataPointColor: "white" },
  ],
  "This Month": [
    { value: 15, label: "Week 1", dataPointColor: "white" },
    { value: 18, label: "Week 2", dataPointColor: "white" },
    { value: 22, label: "Week 3", dataPointColor: "white" },
    { value: 26, label: "Week 4", dataPointColor: "white" },
  ],
  "Last Month": [
    { value: 12, label: "Week 1", dataPointColor: "white" },
    { value: 16, label: "Week 2", dataPointColor: "white" },
    { value: 20, label: "Week 3", dataPointColor: "white" },
    { value: 24, label: "Week 4", dataPointColor: "white" },
  ],
};
export default earningsOptions;
