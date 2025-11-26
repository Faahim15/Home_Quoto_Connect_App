import { api } from "../../api/baseApi";

export const jobSlice = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ==================== MUTATIONS ====================

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
      invalidatesTags: ["Jobs", "TodaysJobs", "MyJobs", "ActiveJobs", "User"],
    }),

    // ==================== QUERIES ====================

    getAllJobs: builder.query({
      query: ({
        page = 1,
        limit = 10,
        serviceType,
        urgent,
        minPrice,
        maxPrice,
        rating,
        experienceLevel,
        specializations,
        search,
        latitude,
        longitude,
        radius = 10000,
        sortBy = "createdAt",
      } = {}) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", limit.toString());
        params.append("radius", radius.toString());
        params.append("sortBy", sortBy);

        if (serviceType) params.append("serviceType", serviceType);
        if (urgent !== undefined) params.append("urgent", urgent.toString());
        if (minPrice !== undefined)
          params.append("minPrice", minPrice.toString());
        if (maxPrice !== undefined)
          params.append("maxPrice", maxPrice.toString());
        if (rating !== undefined) params.append("rating", rating.toString());
        if (experienceLevel) params.append("experienceLevel", experienceLevel);
        if (specializations) params.append("specializations", specializations);
        if (search) params.append("search", search);
        if (latitude !== undefined)
          params.append("latitude", latitude.toString());
        if (longitude !== undefined)
          params.append("longitude", longitude.toString());

        return {
          url: `/jobs?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Jobs"],
    }),

    getMyJobs: builder.query({
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

    getSingleJob: builder.query({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Job", id: arg }],
    }),

    getServiceCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    getSpecializations: builder.query({
      query: () => ({
        url: "/categories/specializations",
        method: "GET",
      }),
      providesTags: ["Specializations"],
    }),

    getProviderDetails: builder.query({
      query: (id) => ({
        url: `/popular/providers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Provider", id: arg }],
    }),

    getProviderProfileDetails: builder.query({
      query: (id) => ({
        url: `/providers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Profile", id: arg }],
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
  // Mutations
  useCreateJobMutation,
  useUpdateJobMutation,
  useCancelJobMutation,
  useDeleteJobMutation,

  // Queries
  useGetAllJobsQuery,
  useGetMyJobsQuery,
  useGetTodaysJobsQuery,
  useGetActiveJobsQuery,
  useGetSingleJobQuery,
  useGetServiceCategoriesQuery,
  useGetSpecializationsQuery,
  useGetProviderDetailsQuery,
  useGetProviderProfileDetailsQuery,
  useGetPopularProvidersQuery,
} = jobSlice;
