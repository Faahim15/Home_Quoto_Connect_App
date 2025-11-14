import { api } from "../../api/baseApi";

export const quoteSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    acceptQuote: builder.mutation({
      query: ({ id }) => ({
        url: `/quotes/${id}/accept`,
        method: "PUT",
      }),
      invalidatesTags: ["MyJobs"],
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
        "user",
      ],
    }),

    cancelQuote: builder.mutation({
      query: ({ id }) => ({
        url: `/quotes/${id}/decline`,
        method: "PUT",
      }),
      invalidatesTags: ["DeclineJob"],
    }),
  }),
  overrideExisting: true,
});

// ✅ Export hooks
export const {
  useAcceptQuoteMutation,
  useSubmitQuoteMutation,
  useCancelQuoteMutation,
} = quoteSlice;
