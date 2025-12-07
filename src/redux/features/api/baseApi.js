import { createApi } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.10.20.30:5000/api";

// Base query function using only fetch
const baseQueryWithRath = async (args, api, extraOptions) => {
  try {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    console.log("Token retrieved:", token ? "Token exists" : "No token");
    console.log("Request URL:", `${BASE_URL}${args.url}`);
    console.log("Request method:", args.method);

    // Check if the body is FormData
    const isFormData = args.body instanceof FormData;

    // Build headers
    const headers = {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Add any custom headers from args
    if (args.headers) {
      Object.assign(headers, args.headers);
    }

    console.log("Request headers:", JSON.stringify(headers, null, 2));

    // Prepare request body
    let body = args.body;
    if (!isFormData && body && typeof body === "object") {
      body = JSON.stringify(body);
    }

    // Make the fetch request
    const response = await fetch(`${BASE_URL}${args.url}`, {
      method: args.method || "GET",
      headers: headers,
      body: body,
    });

    console.log("Response status:", response.status);

    // Handle unauthorized responses
    if (response.status === 401 || response.status === 403) {
      console.log("Unauthorized - removing token");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }

    // Parse response
    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log("Response data:", data);

    // Check if response is ok
    if (!response.ok) {
      return {
        error: {
          status: response.status,
          data: data,
        },
      };
    }

    return { data };
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error message:", error.message);

    return {
      error: {
        status: error.status || 500,
        data: error.message || "Network error occurred",
      },
    };
  }
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRath,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "PopularProviders",
    "Provider",
    "chat",
    "Jobs",
    "Job",
    "TodaysJobs",
    "MyJobs",
    "Quotes",
    "DeclineJob",
    "ActiveJobs",
    "Categories",
    "Specializations",
    "Content",
    "SupportTickets",
    "SupportTicketsMessages",
    "Profile",
    "Transactions",
    "Reviews",
    "Wallet",
    "Payments",
    "Subscriptions",
    "MySubscriptions",
    "Credits",
    "notifications",
  ],
});
