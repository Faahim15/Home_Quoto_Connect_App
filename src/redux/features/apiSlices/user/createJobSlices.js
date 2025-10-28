import { api } from "../../api/baseApi";

export const jobSlice = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (formData) => {
        console.log("📦 jobs api sending:", formData);
        return {
          url: "/jobs",
          method: "POST",
          body: formData,
          formData: true,
          // ✅ DO NOT manually set Content-Type for FormData
          // headers: { "Content-Type": "multipart/form-data" } ❌ remove this line
        };
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useCreateJobMutation } = jobSlice;
