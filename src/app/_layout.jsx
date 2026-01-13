import { Stack } from "expo-router";
import "../../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/store/store";
import { StripeProvider } from "@stripe/stripe-react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    // Keep splash screen visible while fonts are loading
    return null;
  }

  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey={
          "pk_test_51OEwyREeCzTfvWZ6ioncRP3dTECDFEvBBpMbMpd5X9exsOGlHQ309xRYcLlFgB7QTtdL5lrCjQSOfKcArnljr4bu008JbeZ9HL"
        }
      >
        <View className="flex-1 bg-[#F9FAFB]">
          <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </View>
      </StripeProvider>
    </Provider>
  );
}
