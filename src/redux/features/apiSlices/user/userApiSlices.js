import { api } from "../../api/baseApi";

// homeApiSlices.js
export const homeApiSlices = api.injectEndpoints({
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => ({
        url: `/profile/me`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Get specific content (Public) - Privacy Policy, Terms & Conditions, etc.
    getContent: builder.query({
      query: (contentType) => ({
        url: `/content/${contentType}`,
        method: "GET",
      }),
      providesTags: (result, error, contentType) => [
        { type: "Content", id: contentType },
      ],
    }),
  }),
});

export const { useUserProfileQuery, useGetContentQuery } = homeApiSlices;
