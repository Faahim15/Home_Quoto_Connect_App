import { api } from "../../api/baseApi";

export const paymentSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create Payment Intent (Stripe)
    createPaymentIntent: builder.mutation({
      query: (body) => ({
        url: "/payments/create-payment-intent",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "PopularProviders",
        "Provider",
        "Jobs",
        "Job",
        "TodaysJobs",
        "MyJobs",
        "Quotes",
        "DeclineJob",
        "ActiveJobs",
        "SupportTickets",
        "Profile",
      ],
    }),
  }),

  overrideExisting: true,
});

// Export Hooks
export const { useCreatePaymentIntentMutation } = paymentSlice;
