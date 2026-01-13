import { Stack } from "expo-router";
import stackScreenOptions from "../components/shared/layout/TitleStyle";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="calenderBooking"
        options={{
          title: "Select Date & Time",
          ...stackScreenOptions,
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
          title: "Popular Services",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="providerViewAll"
        options={{
          title: "Service Providers",
          ...stackScreenOptions,
        }}
      />
    </Stack>
  );
}
