import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// https://api.quoto.ca/api
// Base query function using axios (with fetch for FormData)
const baseQueryWithRath = async (args, api, extraOptions) => {
  try {
    const token = await AsyncStorage.getItem("token"); 
    
    const isFormData = args.body instanceof FormData;

    // Use fetch for FormData uploads
    if (isFormData) {
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Don't set Content-Type for FormData - let browser set it with boundary
      };

      const response = await fetch(
        `https://api.quoto.ca/api${args.url}`,
        {
          method: args.method,
          headers: headers,
          body: args.body,
        }
      );

      if (response.status === 403 || response.status === 401) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      }

      const data = await response.json();

      if (!response.ok) {
        return { error: data };
      }

      return { data };
    }

    // Use axios for non-FormData requests
    const headers = {
      ...args.headers,
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const result = await axios({
      baseURL:
        "https://api.quoto.ca/api",
      url: args.url,
      method: args.method,
      data: args.body,
      headers: headers,
    });

    if (result?.status === 403 || result?.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }

    return { data: result.data };
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error response:", error.response);

    // Handle auth errors in catch block
    if (error.response?.status === 403 || error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }

    return {
      error: {
        status: error.response?.status || 500,
        data: error.response?.data || error.message || "Something went wrong",
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
