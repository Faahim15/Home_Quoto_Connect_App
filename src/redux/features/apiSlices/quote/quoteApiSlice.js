import { api } from "../../api/baseApi";

export const quoteSlice = api.injectEndpoints(
  {
    endpoints: (builder) => ({
      acceptQuote: builder.mutation({
        query: ({ id }) => ({
          url: `/quotes/${id}/accept`,
          method: "PUT",
        }),
        invalidatesTags: ["MyJobs"],
      }),

      cancelQuote: builder.mutation({
        query: ({ id }) => ({
          url: `/quotes/${id}/decline`,
          method: "PUT",
        }),
        invalidatesTags: ["MyJobs"],
      }),
    }),
  },
  {
    overrideExisting: true,
  }
);

// ✅ Export hooks
export const { useAcceptQuoteMutation, useCancelQuoteMutation } = quoteSlice;
