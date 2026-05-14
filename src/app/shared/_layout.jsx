import { Stack } from "expo-router";
import stackScreenOptions from "../components/shared/layout/TitleStyle";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="notification"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="directBooking"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="directFormBooking"
        options={{
          headerShown: false,
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
          headerShown: false,
        }}
      />
    </Stack>
  );
}
