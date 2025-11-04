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
      invalidatesTags: ["user"],
    }),

    getAllJobs: builder.query({
      query: () => ({
        url: "/jobs/my-jobs",
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),
    getTodaysJobs: builder.query({
      query: () => ({
        url: "/jobs/today",
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),

    getActiveJobs: builder.query({
      query: () => ({
        url: "/jobs/active",
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),

    getServiceCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),

    // ✅ NEW: Single Job by ID
    getSingleJob: builder.query({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),
    getProviderDetails: builder.query({
      query: (id) => ({
        url: `/popular/providers/${id}`,
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),

    //Specializations

    getSpecializations: builder.query({
      query: () => ({
        url: "/categories/specializations",
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),
    getPopularProviders: builder.query({
      query: () => ({
        url: "/popular/providers?sortBy=popularity",
        method: "GET",
      }),
      providesTags: ["Jobs"],
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
