import "dotenv/config";
export default {
  expo: {
    scheme: "razahomequoto",
    name: "raza-home-quoto-v2",
    slug: "raza-home-quoto-v2",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/logo/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera for video calls.",
        NSMicrophoneUsageDescription:
          "This app uses the microphone for audio calls.",
        NSPhotoLibraryUsageDescription:
          "This app needs access to save invoice PDFs.",
        NSPhotoLibraryAddUsageDescription:
          "This app needs access to save invoice PDFs to your photo library.",
      },
    },
    android: {
      package: "com.fahim.razahomequoto",
      permissions: [
        "CAMERA",
        "RECORD_AUDIO",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO",
        "ACCESS_MEDIA_LOCATION",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo/logo.png",
        backgroundColor: "#ffffff",
      },

      softwareKeyboardLayoutMode: "resize",

      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/images/logo/logo.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      "expo-font",
      [
        "expo-media-library",
        {
          photosPermission:
            "Allow Raza Home Quoto to access your photos to save invoice PDFs.",
          savePhotosPermission:
            "Allow Raza Home Quoto to save invoice PDFs to your device.",
          isAccessMediaLocationEnabled: true,
        },
      ],
    ],
    extra: {
      router: {},
      eas: {
        projectId: "aa1e8043-916e-4acb-bf69-6b1053905d95",
      },
    },
    owner: "fahim15",
  },
};
