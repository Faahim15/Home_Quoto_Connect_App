import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="allJobDetails" />
      <Stack.Screen name="mapJobDetails" />
      <Stack.Screen name="quotesDetails" />
      <Stack.Screen name="progressQuote" />
      <Stack.Screen name="serviceProfile" />
      <Stack.Screen name="jobDetails" />
    </Stack>
  );
}
