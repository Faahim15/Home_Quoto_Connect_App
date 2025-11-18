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

    // Delete user account with current password - RAW JSON format
    deleteAccount: builder.mutation({
      query: (passwordData) => ({
        url: `/profile/delete-account`,
        method: "DELETE",
        body: {
          password: passwordData.password,
        },
        // Ensure JSON content type
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useUserProfileQuery,
  useGetContentQuery,
  useDeleteAccountMutation,
} = homeApiSlices;
