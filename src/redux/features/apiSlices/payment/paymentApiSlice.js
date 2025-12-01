import { api } from "../../api/baseApi";

export const paymentSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ----------------------------------------------------
    // ⭐ Setup Stripe Connect (POST)
    // ----------------------------------------------------
    setupStripeConnect: builder.mutation({
      query: (body) => ({
        url: "/payments/setup-connect",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Payments", "Wallet"],
    }),

    // ----------------------------------------------------
    // ⭐ Create Payment Intent (POST)
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
        "Payments",
      ],
    }),

    // ----------------------------------------------------
    // ⭐ GET Transaction by Job ID
    // ----------------------------------------------------
    getTransactionByJob: builder.query({
      query: (jobId) => ({
        url: `/payments/transaction/by-job/${jobId}`,
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),

    // ----------------------------------------------------
    // ⭐ Confirm Cash Payment (PUT)
    // ----------------------------------------------------
    confirmCashPayment: builder.mutation({
      query: (transactionId) => ({
        url: `/payments/cash/${transactionId}/confirm`,
        method: "PUT",
      }),
      invalidatesTags: ["Payments", "Jobs", "Job"],
    }),

    // ----------------------------------------------------
    // ⭐ Purchase Subscription (POST)
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
    // ⭐ Purchase Credits (POST)
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
    // ⭐ GET My Subscription
    // GET: /subscriptions/my-subscription
    // ----------------------------------------------------
    getSubscriptionPackage: builder.query({
      query: () => ({
        url: `/subscriptions`,
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),

    getMySubscription: builder.query({
      query: () => ({
        url: `/subscriptions/my-subscription`,
        method: "GET",
      }),
      providesTags: ["MySubscriptions"],
    }),

    // ----------------------------------------------------
    // ⭐ GET Credits Activity
    // GET: /subscriptions/credits/activity
    // ----------------------------------------------------
    getCreditsActivity: builder.query({
      query: () => ({
        url: `/subscriptions/credits/activity`,
        method: "GET",
      }),
      providesTags: ["Credits", "Payments"],
    }),

    // ----------------------------------------------------
    // ⭐ GET Credits Packages
    // GET: subscriptions/credits/packages
    // ----------------------------------------------------
    getCreditsPackages: builder.query({
      query: () => ({
        url: `subscriptions/credits/packages`,
        method: "GET",
      }),
      providesTags: ["Credits", "Payments"],
    }),

    // ----------------------------------------------------
    // ⭐ GET Wallet Info
    // GET: /payments/wallet
    // ----------------------------------------------------
    getWallet: builder.query({
      query: () => ({
        url: `/payments/wallet`,
        method: "GET",
      }),
      providesTags: ["Wallet", "Payments"],
    }),
  }),

  overrideExisting: true,
});

// Export Hooks
export const {
  useSetupStripeConnectMutation,
  useCreatePaymentIntentMutation,
  useGetTransactionByJobQuery,
  useConfirmCashPaymentMutation,
  usePurchaseSubscriptionMutation,
  usePurchaseCreditsMutation,
  useGetSubscriptionPackageQuery,
  useGetMySubscriptionQuery,
  useGetCreditsActivityQuery,
  useGetCreditsPackagesQuery,
  useGetWalletQuery,
} = paymentSlice;
