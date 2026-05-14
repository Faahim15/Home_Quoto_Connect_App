import { Stack } from "expo-router";
import stackScreenOptions from "../components/shared/layout/TitleStyle";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="allJobDetails"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="mapJobDetails"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="quotesDetails"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="progressQuote"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="serviceProfile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="jobDetails"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
