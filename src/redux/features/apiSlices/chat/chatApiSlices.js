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
    }),
  },
  {
    overrideExisting: true, // ✅ moved outside
  }
);

// Export hooks for usage in React components
export const {
  useDirectChatMutation,
  useGetChatsQuery,
  useGetSingleChatHistoryQuery,
} = chatSlice;
