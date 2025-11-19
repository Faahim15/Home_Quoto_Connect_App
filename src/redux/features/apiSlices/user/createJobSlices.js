import { api } from "../../api/baseApi";
export const jobSlice = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (formData) => {
        return {
          url: "/jobs",
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
      invalidatesTags: ["Jobs", "TodaysJobs", "MyJobs", "ActiveJobs", "User"],
    }),

    // NEW: Update job mutation
    updateJob: builder.mutation({
      query: ({ jobId, formData }) => {
        return {
          url: `/jobs/${jobId}`,
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
      invalidatesTags: ["Jobs", "TodaysJobs", "MyJobs", "ActiveJobs", "User"],
    }),

    cancelJob: builder.mutation({
      query: ({ jobId, reason }) => ({
        url: `/jobs/${jobId}/cancel`,
        method: "PUT",
        body: {
          cancellationReason: reason,
        },
      }),
      invalidatesTags: ["Jobs", "TodaysJobs", "MyJobs", "ActiveJobs", "User"],
    }),

    deleteJob: builder.mutation({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs", "TodaysJobs", "MyJobs", "ActiveJobs", "User"], // This will refetch relevant queries
    }),

    getAllJobs: builder.query({
      query: () => ({
        url: "/jobs/my-jobs",
        method: "GET",
      }),
      providesTags: ["MyJobs"],
    }),

    getTodaysJobs: builder.query({
      query: () => ({
        url: "/jobs/today",
        method: "GET",
      }),
      providesTags: ["TodaysJobs"],
    }),

    getActiveJobs: builder.query({
      query: () => ({
        url: "/jobs/active",
        method: "GET",
      }),
      providesTags: ["ActiveJobs"],
    }),

    getServiceCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // ✅ NEW: Single Job by ID
    getSingleJob: builder.query({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Job", id: arg }],
    }),

    getProviderDetails: builder.query({
      query: (id) => ({
        url: `/popular/providers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Provider", id: arg }],
    }),

    //provider  profile details

    getProviderProfileDetails: builder.query({
      query: (id) => ({
        url: `/providers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Profile", id: arg }],
    }),

    //Specializations

    getSpecializations: builder.query({
      query: () => ({
        url: "/categories/specializations",
        method: "GET",
      }),
      providesTags: ["Specializations"],
    }),

    getPopularProviders: builder.query({
      query: () => ({
        url: "/popular/providers",
        method: "GET",
      }),
      providesTags: ["PopularProviders"],
    }),
  }),
});
export const {
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetAllJobsQuery,
  useGetTodaysJobsQuery,
  useGetActiveJobsQuery,
  useGetSingleJobQuery,
  useGetProviderDetailsQuery,
  useGetProviderProfileDetailsQuery,
  useGetSpecializationsQuery,
  useGetServiceCategoriesQuery,
  useGetPopularProvidersQuery,
  useCancelJobMutation,
} = jobSlice;
