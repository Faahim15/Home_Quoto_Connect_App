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

        // Only append if value exists and is not undefined/null
        if (page !== undefined && page !== null) {
          params.append("page", page.toString());
        }

        if (limit !== undefined && limit !== null) {
          params.append("limit", limit.toString());
        }

        if (radius !== undefined && radius !== null) {
          params.append("radius", radius.toString());
        }

        if (sortBy) {
          params.append("sortBy", sortBy);
        }

        // Only append optional parameters if they have values
        if (serviceType) {
          params.append("serviceType", serviceType);
        }

        if (urgent !== undefined && urgent !== null) {
          params.append("urgent", urgent.toString());
        }

        if (minPrice !== undefined && minPrice !== null) {
          params.append("minPrice", minPrice.toString());
        }

        if (maxPrice !== undefined && maxPrice !== null) {
          params.append("maxPrice", maxPrice.toString());
        }

        if (rating !== undefined && rating !== null) {
          params.append("rating", rating.toString());
        }

        if (experienceLevel) {
          params.append("experienceLevel", experienceLevel);
        }

        if (specializations) {
          params.append("specializations", specializations);
        }

        if (search) {
          params.append("search", search);
        }

        if (latitude !== undefined && latitude !== null) {
          params.append("latitude", latitude.toString());
        }

        if (longitude !== undefined && longitude !== null) {
          params.append("longitude", longitude.toString());
        }

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

    // Search Providers
    searchProviders: builder.query({
      query: ({ minRating, sortBy, serviceCategory, search } = {}) => {
        const params = new URLSearchParams();

        if (minRating) params.append("minRating", minRating);
        if (sortBy) params.append("sortBy", sortBy);
        if (serviceCategory) params.append("serviceCategory", serviceCategory);
        if (search) params.append("searchQuery", search);

        return {
          url: `/popular/providers?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["PopularProviders"],
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
  useSearchProvidersQuery,
  useGetPopularProvidersQuery,
} = jobSlice;
