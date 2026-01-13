import { Stack } from "expo-router";
import stackScreenOptions from "../components/shared/layout/TitleStyle";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="notification"
        options={{
          title: "Notifications",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="directBooking"
        options={{
          title: "Post a Job",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="directFormBooking"
        options={{
          title: "Post a Job",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="directJobLocation"
        options={{
          title: "Post a Job",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="directJobSummary"
        options={{
          title: "Book Provider",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="serviceDetails"
        options={{
          title: "ServiceDetails",
          ...stackScreenOptions,
        }}
      />
    </Stack>
  );
}
