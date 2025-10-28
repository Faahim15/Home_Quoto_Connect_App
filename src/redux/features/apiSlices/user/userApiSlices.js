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

    promotedVideo: builder.query({
      query: ({ category_id }) => ({
        url: `/get-promotional-video?category_id=${category_id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    promotedVideoHome: builder.query({
      query: () => ({
        url: `/get-promotional-video?per_page=10`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    caragoryVideos: builder.query({
      query: () => ({
        url: `/home-video?video_limit=3`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    priceGetAll: builder.query({
      query: () => ({
        url: `/get-price`,
        method: "GET",
      }),
      providesTags: ["uploadVideo"],
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
