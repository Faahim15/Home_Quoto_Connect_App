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
           headers:{
                    "Content-Type" : "multipart/form-data"
            },
          body: formData,
          // formData: true,
          // ✅ DO NOT manually set Content-Type for FormData
          // headers: { "Content-Type": "multipart/form-data" } ❌ remove this line
        };
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useCreateJobMutation } = jobSlice;
