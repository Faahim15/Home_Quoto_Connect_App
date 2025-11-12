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
      invalidatesTags: ["Jobs", "TodaysJobs", "MyJobs", "ActiveJobs"],
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
  useGetAllJobsQuery,
  useGetTodaysJobsQuery,
  useGetActiveJobsQuery,
  useGetSingleJobQuery,
  useGetProviderDetailsQuery,
  useGetSpecializationsQuery,
  useGetServiceCategoriesQuery,
  useGetPopularProvidersQuery,
} = jobSlice;
