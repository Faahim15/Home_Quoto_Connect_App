import { api } from "../../api/baseApi";

// homeApiSlices.js
export const homeApiSlices = api.injectEndpoints({
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => ({
        url: `/profile/me`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useUserProfileQuery,
  usePromotedVideoQuery,
  useCaragoryVideosQuery,
  usePromotedVideoHomeQuery,
  usePriceGetAllQuery,
} = homeApiSlices;
