import { Stack } from "expo-router";
import stackScreenOptions from "../components/shared/layout/TitleStyle";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="editProfile"
        options={{
         headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="changePassword"
        options={{
          title: "Change Password",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
         headerShown: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
         headerShown: false,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: "About Us",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          // title: "Help & support",
          // ...stackScreenOptions, 
          headerShown: false,
        }}
      />
    </Stack>
  );
}
