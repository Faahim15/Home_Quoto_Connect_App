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

    // ✅ Today's Jobs endpoint
    getTodaysJobs: builder.query({
      query: () => ({
        url: "/jobs/today",
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),

    // ✅ Active Jobs endpoint
    getActiveJobs: builder.query({
      query: () => ({
        url: "/jobs/active",
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
} = jobSlice;
