import { api } from "../../api/baseApi";
export const jobSlice = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (formData) => {
        console.log("📦 job api before sending:", formData);
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

    //Specializations

    getSpecializations: builder.query({
      query: () => ({
        url: "/categories/specializations",
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),
  }),
});
export const {
  useCreateJobMutation,
  useGetTodaysJobsQuery,
  useGetActiveJobsQuery,
  useGetSingleJobQuery,
  useGetSpecializationsQuery,
  useGetServiceCategoriesQuery,
} = jobSlice;
