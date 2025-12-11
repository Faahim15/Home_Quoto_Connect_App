import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

      if (!token) {
        setInitialRoute("/onboarding/welcome");
      } else {
        if (role === "provider") setInitialRoute("/provider/home");
        else setInitialRoute("/home");
      }
    };

    checkUserRole();
  }, []);

  if (!initialRoute) return null;

  return <Redirect href={initialRoute} />;
}
