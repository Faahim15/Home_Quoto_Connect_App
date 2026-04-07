import { Stack } from "expo-router";
import "../../global.css";
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
          "pk_live_51SkvMt3z3vRnX5coWDFgACgRGodbVl3yVMtJ7P07PAC21Df21MkwRSmqlgHU4VvEBUTKif9ChmyQRbsMbDExHSRl00ZuRgfDRt"
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
