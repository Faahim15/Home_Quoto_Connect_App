import { Stack } from "expo-router";
import "../../global.css";
import { StatusBar, View } from "react-native";
import Toast from "react-native-toast-message";
import { Toaster } from "sonner-native";
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
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StripeProvider
          publishableKey={
            "pk_live_51SkvMt3z3vRnX5coWDFgACgRGodbVl3yVMtJ7P07PAC21Df21MkwRSmqlgHU4VvEBUTKif9ChmyQRbsMbDExHSRl00ZuRgfDRt"
          }
        >
          <View className="flex-1 bg-[#F9FAFB]">
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Stack screenOptions={{ headerShown: false }} />
          </View>
          <Toaster />
          <Toast />
        </StripeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}