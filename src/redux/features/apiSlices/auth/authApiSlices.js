import { api } from "../../api/baseApi";

// authApiSlices.js
export const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (formData) => {
        // console.log("register api", formData);
        return {
          url: `/auth/register`,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
      },
      invalidatesTags: ["user"],
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => {
        console.log("loginUser api", data);
        return {
          url: `/auth/login`,
          method: "POST",
          body: data,
        };
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/send-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
  overrideExisting: true,
});

// Export hooks for usage in React components
export const {
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} = authSlice;
