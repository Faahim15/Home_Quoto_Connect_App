import { api } from "../../api/baseApi";

export const paymentSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ----------------------------------------------------
    // ⭐ Create Payment Intent (Stripe)
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // ⭐ Get Transaction by Job ID
    // ----------------------------------------------------
    getTransactionByJob: builder.query({
      query: (jobId) => ({
        url: `/payments/transaction/by-job/${jobId}`,
        method: "GET",
      }),
      providesTags: ["Transactions"],
    }),

    // ----------------------------------------------------
    // ⭐ Confirm Cash Payment
    // ----------------------------------------------------
    confirmCashPayment: builder.mutation({
      query: (transactionId) => ({
        url: `/payments/cash/${transactionId}/confirm`,
        method: "PUT",
      }),
      invalidatesTags: ["Transactions", "Jobs", "Job"],
    }),

    // ----------------------------------------------------
    // ⭐ Purchase Subscription
    // ----------------------------------------------------
    purchaseSubscription: builder.mutation({
      query: (body) => ({
        url: "/subscriptions/purchase",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Subscriptions", "Payments"],
    }),

    // ----------------------------------------------------
    // ⭐ Purchase Credits
    // ----------------------------------------------------
    purchaseCredits: builder.mutation({
      query: (body) => ({
        url: "/subscriptions/credits/purchase",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Credits", "Payments"],
    }),

    // ----------------------------------------------------
    // ⭐ Get My Subscription
    // ----------------------------------------------------
    getMySubscription: builder.query({
      query: () => `/subscriptions/my-subscription`,
      providesTags: ["Subscriptions"],
    }),

    // ----------------------------------------------------
    // ⭐ Get Credits Activity
    // GET: /subscriptions/credits/activity
    // ----------------------------------------------------
    getCreditsActivity: builder.query({
      query: () => `/subscriptions/credits/activity`,
      providesTags: ["Credits"],
    }),
  }),

  overrideExisting: true,
});

// Export Hooks
export const {
  useCreatePaymentIntentMutation,
  useGetTransactionByJobQuery,
  useConfirmCashPaymentMutation,
  usePurchaseSubscriptionMutation,
  usePurchaseCreditsMutation,
  useGetMySubscriptionQuery,
  useGetCreditsActivityQuery,
} = paymentSlice;
