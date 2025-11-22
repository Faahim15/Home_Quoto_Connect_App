import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base query function using axios (with fetch for FormData)
const baseQueryWithRath = async (args, api, extraOptions) => {
  try {
    const token = await AsyncStorage.getItem("token");

    // Check if the body is FormData
    const isFormData = args.body instanceof FormData;

    // Use fetch for FormData, axios for everything else
    if (isFormData) {
      console.log("Using fetch for FormData upload");

      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        // Don't set Content-Type for FormData
      };

      const response = await fetch(`http://10.10.20.30:5000/api${args.url}`, {
        method: args.method,
        headers: headers,
        body: args.body,
      });

      console.log("Fetch response status:", response.status);

      if (response.status === 403 || response.status === 401) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      }

      const data = await response.json();
      console.log("Fetch response data:", data);

      if (!response.ok) {
        return { error: data };
      }

      return { data };
    }

    // Use axios for non-FormData requests
    const result = await axios({
      baseURL: "http://10.10.20.30:5000/api",
      ...args,
      url: args.url,
      method: args.method,
      data: args.body,
      headers: {
        ...args.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (result?.status === 403 || result?.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }

    if (typeof result?.data === "string") {
      const withCurly = (result.data += "}");
      return { data: JSON.parse(withCurly) };
    }

    if (typeof result?.data === "object") {
      return { data: result.data };
    }

    return { data: result.data };
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error response:", error.response);

    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        const withCurly = (error.response.data += "}");
        return { error: JSON.parse(withCurly) };
      } else {
        return { error: error.response.data };
      }
    }
    return {
      error: {
        status: error.response?.status || 500,
        data: error.message || "Something went wrong",
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
    "Profile",
  ],
});
