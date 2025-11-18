import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Base query function using axios
const baseQueryWithRath = async (args, api, extraOptions) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const result = await axios({
      baseURL: "http://10.10.20.30:5000/api",
      ...args,
      url: args.url,
      method: args.method,
      data: args.body,
      headers: {
        ...args.headers,
        Authorization: token ? `Bearer ${token}` : "",
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
  ],
});
