import { Stack } from "expo-router";
import stackScreenOptions from "../components/shared/layout/TitleStyle";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="calenderBooking"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="showAllJobs"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="popularServicesView"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="providerViewAll"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="providerDetails"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
