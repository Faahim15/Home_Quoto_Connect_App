import { createApi } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TagTypes from "../../../app/components/constant/tagTypes.constant";

const baseQueryWithRath = async (args, api, extraOptions) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  try {
    const token = await AsyncStorage.getItem("token");

    const isFormData =
      typeof FormData !== "undefined" &&
      args.body &&
      typeof args.body.append === "function";

    // Use fetch for FormData uploads
    if (isFormData) {
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`${API_URL}${args.url}`, {
        method: args.method,
        headers,
        body: args.body,
      });

      if (response.status === 403 || response.status === 401) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      }

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        return { error: data };
      }

      return { data };
    }

    // Use fetch for non-FormData requests (axios removed)
    const headers = {
      ...args.headers,
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    console.log("=== API REQUEST ===");
    console.log("URL:", API_URL + args.url);
    console.log("Method:", args.method);
    console.log("Body:", JSON.stringify(args.body));
    console.log("Headers:", JSON.stringify(headers));

    const response = await fetch(`${API_URL}${args.url}`, {
      method: args.method,
      headers,
      body: args.body ? JSON.stringify(args.body) : undefined,
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (response.status === 403 || response.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          data,
        },
      };
    }

    return { data };
  } catch (error) {
    console.log("=== API ERROR ===");
    console.log("Message:", error.message);

    return {
      error: {
        status: 500,
        data: error.message || "Something went wrong",
      },
    };
  }
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRath,
  endpoints: () => ({}),
  tagTypes: Object.values(TagTypes),
});
