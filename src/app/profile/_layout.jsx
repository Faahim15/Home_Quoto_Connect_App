import { Stack } from "expo-router";
import stackScreenOptions from "../components/shared/layout/TitleStyle";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="editProfile"
        options={{
          title: "Edit Profile",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Account Settings",
          ...stackScreenOptions,
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
          title: "Terms and Conditions",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy Policy",
          ...stackScreenOptions,
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
          title: "Help & support",
          ...stackScreenOptions,
        }}
      />
    </Stack>
  );
}
