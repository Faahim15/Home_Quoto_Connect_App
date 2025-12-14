import { api } from "../../api/baseApi";

// chat Slices
export const chatSlice = api.injectEndpoints(
  {
    endpoints: (builder) => ({
      directChat: builder.mutation({
        query: (formData) => ({
          url: `/chats/direct`,
          method: "POST",
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
          body: formData,
        }),
        invalidatesTags: ["chat"],
      }),
      getNotifications: builder.query({
        query: () => ({
          url: `/notifications`,
          method: "GET",
        }),
        providesTags: ["notifications"],
      }),
      getChats: builder.query({
        query: () => ({
          url: `/chats`,
          method: "GET",
        }),
        providesTags: ["chat"],
      }),

      getSingleChatHistory: builder.query({
        query: (id) => ({
          url: `/chats/${id}/messages`,
          method: "GET",
        }),
        providesTags: ["chat"],
      }),

      // NEW: Report a User API
      reportUser: builder.mutation({
        query: (reportData) => ({
          url: `/reports`,
          method: "POST",
          body: reportData,
          // Note: Based on the image, it seems to use form-data encoding
          // You can uncomment headers if needed
          // headers: {
          //   "Content-Type": "application/x-www-form-urlencoded",
          // },
        }),
        // Optionally invalidate tags if needed
        // invalidatesTags: ["reports"],
      }),
    }),
  },
  {
    overrideExisting: true, // ✅ moved outside
  }
);

// Export hooks for usage in React components
export const {
  useDirectChatMutation,
  useGetNotificationsQuery,
  useGetChatsQuery,
  useGetSingleChatHistoryQuery,
  useReportUserMutation, // NEW: Export the report user hook
} = chatSlice;
