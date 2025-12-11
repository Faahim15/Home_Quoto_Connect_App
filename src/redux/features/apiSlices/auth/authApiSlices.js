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
      invalidatesTags: ["User"],
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
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
      invalidatesTags: ["User"],
    }),
    logoutUser: builder.mutation({
      query: (data) => {
        console.log("loginUser api", data);
        return {
          url: `/auth/logout`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/send-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/profile/change-password`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    // Upload verification documents (PDF for businessLicense, Image for certificate)
    uploadVerificationDocuments: builder.mutation({
      query: (formData) => {
        return {
          url: `/profile/verification-documents`,
          method: "POST",

          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

// Export hooks for usage in React components
export const {
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUploadVerificationDocumentsMutation, // New export
} = authSlice;
