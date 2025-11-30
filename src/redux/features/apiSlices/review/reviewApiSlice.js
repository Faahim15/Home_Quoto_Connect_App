import { api } from "../../api/baseApi";

export const reviewSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ⭐ Create Review
    createReview: builder.mutation({
      query: (body) => ({
        url: `/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "Job",
        "MyJobs",
        "ActiveJobs",
        "TodaysJobs",
        "User",
        "Provider",
        "Reviews",
      ],
    }),

    // ⭐ Get user reviews
    getUserReviews: builder.query({
      query: () => ({
        url: `/reviews/user`,
        method: "GET",
      }),
      providesTags: ["Reviews"],
    }),

    // ⭐ Respond to a review
    respondToReview: builder.mutation({
      query: ({ reviewId, response }) => ({
        url: `/reviews/${reviewId}/respond`,
        method: "POST",
        body: { response },
      }),
      invalidatesTags: ["Reviews"],
    }),

    // ⭐ Get pending reviews
    getPendingReviews: builder.query({
      query: () => ({
        url: `/reviews/pending`,
        method: "GET",
      }),
      providesTags: ["Reviews"],
    }),
  }),

  overrideExisting: true,
});

// Export hooks
export const {
  useCreateReviewMutation,
  useGetUserReviewsQuery,
  useRespondToReviewMutation,
  useGetPendingReviewsQuery,
} = reviewSlice;
