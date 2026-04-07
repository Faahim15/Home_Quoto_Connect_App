import "dotenv/config";
export default {
"expo": {
"name": "Raza Home Quote",
"slug": "raza-home-quoto-v2",
"version": "1.0.0",
"orientation": "portrait",
"scheme": "razahomequoto",
"icon": "./assets/images/logo/logo.png",
"userInterfaceStyle": "light",
"newArchEnabled": true,

"splash": {
  "image": "./assets/images/logo/logo.png",
  "resizeMode": "contain",
  "backgroundColor": "#ffffff"
},

"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.fahim.razahomequoto",
  "buildNumber": "1.0.1",

  "config": {
    "googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY
  },

  "infoPlist": {
    "NSCameraUsageDescription": "This app uses the camera for video calls.",
    "NSMicrophoneUsageDescription": "This app uses the microphone for audio calls.",
    "NSPhotoLibraryUsageDescription": "This app needs access to save invoice PDFs.",
    "NSPhotoLibraryAddUsageDescription": "This app needs access to save invoice PDFs to your device.",
    "NSLocationWhenInUseUsageDescription": "We use your location to show nearby services and improve your experience.",
    "NSLocationAlwaysAndWhenInUseUsageDescription": "We use your location to enhance location-based features."
  }
},

"android": {
  "package": "com.fahim.razahomequoto",
  "softwareKeyboardLayoutMode": "pan",
  "edgeToEdgeEnabled": true,

  "permissions": [
    "CAMERA",
    "RECORD_AUDIO",
    "WRITE_EXTERNAL_STORAGE",
    "READ_EXTERNAL_STORAGE",
    "READ_MEDIA_IMAGES",
    "READ_MEDIA_VIDEO",
    "ACCESS_MEDIA_LOCATION"
  ],

  "config": {
    "googleMaps": {
      "apiKey": process.env.GOOGLE_MAPS_API_KEY
    }
  },

  "adaptiveIcon": {
    "foregroundImage": "./assets/images/logo/logo.png",
    "backgroundColor": "#ffffff"
  }
},

"web": {
  "bundler": "metro",
  "favicon": "./assets/images/logo/logo.png"
},

"plugins": [
  "expo-router",
  "expo-font",
  [
    "expo-media-library",
    {
      "photosPermission": "Allow Raza Home Quote to access your photos to save invoice PDFs.",
      "savePhotosPermission": "Allow Raza Home Quote to save invoice PDFs to your device.",
      "isAccessMediaLocationEnabled": true
    }
  ]
],

"extra": {
  "router": {},
  "eas": {
    "projectId": "aa1e8043-916e-4acb-bf69-6b1053905d95"
  }
},

"owner": "fahim15"

}
}
