import { Stack } from "expo-router";
import stackScreenOptions from "../components/shared/layout/TitleStyle";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="allJobDetails"
        options={{
          title: "Service Details",
          ...stackScreenOptions,
        }}
      />
    </Stack>
  );
}
