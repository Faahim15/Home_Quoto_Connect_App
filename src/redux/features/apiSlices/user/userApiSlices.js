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

    joinLiveSupport: builder.mutation({
      query: (ticketId) => ({
        url: `/support/tickets/${ticketId}/join-live`,
        method: "POST",
      }),
      invalidatesTags: ["SupportTickets"],
    }),

    // Update Profile Photo
    updateProfilePhoto: builder.mutation({
      query: (formData) => ({
        url: `/profile/photo`,
        method: "PUT",
        body: formData,
        // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
      }),
      invalidatesTags: ["User", "Profile"],
    }),

    // Update Profile Data
    updateProfileData: builder.mutation({
      query: (profileData) => ({
        url: `/profile/update`,
        method: "PUT",
        body: profileData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User", "Profile"],
    }),

    // existing endpoints...
    userProfile: builder.query({
      query: () => ({
        url: `/profile/me`,
        method: "GET",
      }),
      providesTags: ["User", "Profile"],
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
      invalidatesTags: ["User", "Profile"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateSupportTicketMutation,
  useJoinLiveSupportMutation,
  useUserProfileQuery,
  useGetContentQuery,
  useDeleteAccountMutation,
  useUpdateProfilePhotoMutation,
  useUpdateProfileDataMutation,
} = homeApiSlices;
