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
      invalidatesTags: ["SupportTickets", "SupportTicketsMessages"],
    }),

    // send support  messages
    sendSupportMessage: builder.mutation({
      query: ({ ticketId, messageType, content }) => {
        const formData = new FormData();

        // Always send message type
        formData.append("messageType", messageType);

        if (messageType === "text") {
          // Text message
          formData.append("content", content);
        } else {
          // Media & File message
          formData.append("content", {
            uri: content.uri,
            name: content.name,
            type: content.type,
          });
        }

        return {
          url: `/support/tickets/${ticketId}/messages`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["SupportTickets"],
    }),

    joinLiveSupport: builder.mutation({
      query: (ticketId) => ({
        url: `/support/tickets/${ticketId}/join-live`,
        method: "POST",
      }),
      invalidatesTags: ["SupportTickets"],
    }),

    getSupportTickets: builder.query({
      query: () => ({
        url: `/support/tickets`,
        method: "GET",
      }),
      providesTags: ["SupportTickets"],
    }),

    // Get messages of a support ticket
    getSupportTicketMessages: builder.query({
      query: (ticketId) => ({
        url: `/support/tickets/${ticketId}/messages`,
        method: "GET",
      }),
      providesTags: (result, error, ticketId) => [
        { type: "SupportTicketsMessages", id: ticketId },
      ],
    }),

    createProjectGallery: builder.mutation({
      query: ({ images, title, serviceCategory, projectDate }) => {
        const formData = new FormData();

        // Append multiple images
        images.forEach((img, index) => {
          formData.append("images", {
            uri: img.uri,
            name: img.name || `image_${index}.jpg`,
            type: img.type || "image/jpeg",
          });
        });

        // Append text fields
        formData.append("title", title);
        formData.append("serviceCategory", serviceCategory);
        formData.append("projectDate", projectDate);

        return {
          url: `/project-gallery`,
          method: "POST",
          body: formData,
          // Do NOT set Content-Type → it must be auto-set
        };
      },
      invalidatesTags: ["PopularProviders", "Provider"],
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

    // Add this inside the endpoints of homeApiSlices
    submitBackgroundCheck: builder.mutation({
      query: ({ idFront, idBack, consentForm }) => {
        const formData = new FormData();

        // Append files
        formData.append("idFront", {
          uri: idFront.uri,
          name: idFront.name || "idFront.png",
          type: idFront.type || "image/png",
        });

        formData.append("idBack", {
          uri: idBack.uri,
          name: idBack.name || "idBack.png",
          type: idBack.type || "image/png",
        });

        formData.append("consentForm", {
          uri: consentForm.uri,
          name: consentForm.name || "consentForm.png",
          type: consentForm.type || "image/png",
        });

        return {
          url: `/background-check/submit`,
          method: "POST",
          body: formData,
          // Do NOT set Content-Type header → let fetch set it for multipart/form-data
        };
      },
      invalidatesTags: ["User", "Profile"], // adjust if needed
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
  useSendSupportMessageMutation,
  useJoinLiveSupportMutation,
  useGetSupportTicketsQuery,
  useUserProfileQuery,
  useGetContentQuery,
  useGetSupportTicketMessagesQuery,
  useDeleteAccountMutation,
  useUpdateProfilePhotoMutation,
  useCreateProjectGalleryMutation,
  useSubmitBackgroundCheckMutation,
  useUpdateProfileDataMutation,
} = homeApiSlices;
