import { api } from "../../api/baseApi";

export const homeApiSlices = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create Support Ticket
    createSupportTicket: builder.mutation({
      query: (ticketData) => ({
        url: `/support/tickets`,
        method: "POST",
        body: {
          title: ticketData.title,
          description: ticketData.description,
          category: ticketData.category,
          priority: ticketData.priority,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["SupportTickets"],
    }),

    // existing endpoints...
    userProfile: builder.query({
      query: () => ({
        url: `/profile/me`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getContent: builder.query({
      query: (contentType) => ({
        url: `/content/${contentType}`,
        method: "GET",
      }),
      providesTags: (result, error, contentType) => [
        { type: "Content", id: contentType },
      ],
    }),

    deleteAccount: builder.mutation({
      query: (passwordData) => ({
        url: `/profile/delete-account`,
        method: "DELETE",
        body: { password: passwordData.password },
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
  useCreateSupportTicketMutation,
} = homeApiSlices;
