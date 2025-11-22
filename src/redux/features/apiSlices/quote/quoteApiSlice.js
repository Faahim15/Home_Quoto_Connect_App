import { api } from "../../api/baseApi";

export const quoteSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ⭐ Book Provider Directly
    bookProvider: builder.mutation({
      query: ({ providerId, body }) => ({
        url: `/popular/providers/${providerId}/book`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "MyJobs",
        "TodaysJobs",
        "ActiveJobs",
        "Job",
        "Provider",
        "PopularProviders",
      ],
    }),

    acceptQuote: builder.mutation({
      query: ({ id }) => ({
        url: `/quotes/${id}/accept`,
        method: "PUT",
      }),
      invalidatesTags: ["MyJobs", "TodaysJobs", "ActiveJobs", "Provider"],
    }),

    submitQuote: builder.mutation({
      query: (formData) => {
        return {
          url: `/quotes`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formData,
        };
      },
      invalidatesTags: [
        "MyJobs",
        "TodaysJobs",
        "ActiveJobs",
        "Job",
        "Provider",
        "PopularProviders",
        "User",
        "Quotes",
      ],
    }),

    updateQuote: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/quotes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [
        "MyJobs",
        "TodaysJobs",
        "ActiveJobs",
        "Job",
        "Provider",
        "PopularProviders",
        "Quotes",
      ],
    }),

    getAllQuotes: builder.query({
      query: () => ({
        url: `/quotes/my-quotes`,
        method: "GET",
      }),
      providesTags: ["Quotes"],
    }),

    cancelQuote: builder.mutation({
      query: ({ id }) => ({
        url: `/quotes/${id}/decline`,
        method: "PUT",
      }),
      invalidatesTags: ["DeclineJob", "Quotes"],
    }),
  }),

  overrideExisting: true,
});

// ✅ Export hooks
export const {
  useBookProviderMutation,
  useAcceptQuoteMutation,
  useSubmitQuoteMutation,
  useUpdateQuoteMutation,
  useGetAllQuotesQuery,
  useCancelQuoteMutation,
} = quoteSlice;
