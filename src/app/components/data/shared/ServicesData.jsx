const servicesData = [
  {
    id: 1,
    title: "Wallpaper on drawing room",
    serviceType: "TV repair",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    designation: "TV Technician",
    providerName: "Jackson",
    description: "Expert in fixing and installing all types of TVs.",
    rating: 4.8,
    reviews: 8,
    price: "$310 - $330",
    timeAgo: "14 m Ago",
    bookingDate: "2025-07-16",
    bookingHours: "10:00 AM - 12:00 PM",
    specializations: ["LED TV", "Smart TV", "Wall Mount Installation"],
    address: "Toronto, ON",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    status: "In Progress",
    quoteOption: "Send a Personalized Quote",
  },
  {
    id: 2,
    title: "Bathroom Tile Installation",
    serviceType: "AC Repair and Maintenance",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    designation: "AC Technician",
    providerName: "Michael",
    description: "Reliable AC servicing to keep you cool year-round.",
    rating: 4.9,
    reviews: 12,
    price: "$270 - $290",
    timeAgo: "25 m Ago",
    bookingDate: "2025-07-17",
    bookingHours: "2:00 PM - 4:00 PM",
    specializations: [
      "Split AC",
      "Window AC",
      "Gas Refilling",
      "Filter Cleaning",
    ],
    address: "Ottawa, ON",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    status: "Completed",
    quoteOption: "Accept",
  },
  {
    id: 3,
    serviceType: "Plumbing Services",
    title: "Living Room Lighting Setup",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=face",
    designation: "Plumber",
    providerName: "Sarah",
    description: "Fast and affordable plumbing solutions for your home.",
    rating: 4.7,
    reviews: 15,
    price: "$140 - $160",
    timeAgo: "1 h Ago",
    bookingDate: "2025-07-18",
    bookingHours: "11:00 AM - 1:00 PM",
    specializations: ["Leak Repair", "Bathroom Fittings", "Pipe Installation"],
    address: "Vancouver, BC",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    status: "In Progress",
    quoteOption: "Send a Personalized Quote",
  },
  {
    id: 4,
    serviceType: "Electrical Repair",
    title: "Garden Landscaping",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f",
    designation: "Electrician",
    providerName: "David",
    description: "Skilled in handling all kinds of electrical issues.",
    rating: 4.6,
    reviews: 7,
    price: "$200 - $220",
    timeAgo: "2 h Ago",
    bookingDate: "2025-07-19",
    bookingHours: "3:00 PM - 5:00 PM",
    specializations: [
      "Wiring",
      "Switchboard Fixing",
      "Fan & Light Installation",
    ],
    address: "Edmonton, AB",
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    status: "In Progress",
    quoteOption: "Send a Personalized Quote",
  },
  {
    id: 5,
    serviceType: "Appliance Repair",
    title: "Floor Polishing Service",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
    designation: "Appliance Technician",
    providerName: "Emma",
    description: "Repairs for all major household appliances at fair prices.",
    rating: 4.9,
    reviews: 20,
    price: "$170 - $190",
    timeAgo: "3 h Ago",
    bookingDate: "2025-07-20",
    bookingHours: "9:00 AM - 11:00 AM",
    specializations: ["Washing Machine", "Microwave Oven", "Refrigerator"],
    address: "Montreal, QC",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    status: "Completed",
    quoteOption: "Accept",
  },
];
export const imagesData = [
  {
    id: "1",
    image: require("../../../../../assets/images/home/jobs/summary1.png"),
  },
  {
    id: "2",
    image: require("../../../../../assets/images/home/jobs/summary2.png"),
  },
  {
    id: "3",
    image: require("../../../../../assets/images/home/jobs/summary1.png"),
  },
  {
    id: "4",
    image: require("../../../../../assets/images/home/jobs/summary2.png"),
  },
  {
    id: "5",
    image: require("../../../../../assets/images/home/jobs/summary1.png"),
  },
  {
    id: "6",
    image: require("../../../../../assets/images/home/jobs/summary1.png"),
  },
];
export const electricianData = [
  {
    id: "1",
    name: "Michael Jackson",
    occupation: "Licensed Electrician",
    rating: 4.9,
    price: "$85/hr",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Jacob Martinez",
    occupation: "Master Plumber",
    rating: 4.7,
    price: "$80/hr",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "William Gill",
    occupation: "Electrical Contractor",
    rating: 4.8,
    price: "$90/hr",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Hakim Ahmed",
    occupation: "Commercial Electrician",
    rating: 4.6,
    price: "$95/hr",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Robert Gill",
    occupation: "Residential Electrician",
    rating: 4.9,
    price: "$75/hr",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "David Hakim",
    occupation: "Industrial Electrician",
    rating: 4.8,
    price: "$100/hr",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: "7",
    name: "Thomas Gill",
    occupation: "Solar Panel Installer",
    rating: 4.7,
    price: "$85/hr",
    image:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
  },
  {
    id: "8",
    name: "Omar Hakim",
    occupation: "Emergency Electrician",
    rating: 4.9,
    price: "$110/hr",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face",
  },
];

export default servicesData;
