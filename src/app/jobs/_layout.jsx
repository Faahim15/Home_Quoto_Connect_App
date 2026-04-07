import { Stack } from "expo-router";
import stackScreenOptions from "../components/shared/layout/TitleStyle";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="uploadPhotos"
        options={{
          // title: "Upload Job Photos",
          // ...stackScreenOptions, 
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="jobForm"
        options={{
          title: "Post a Job",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="jobLocation"
        options={{
          title: "Post a Job",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="jobSummary"
        options={{
          title: "Job Summary",
          ...stackScreenOptions,
        }}
      />
    </Stack>
  );
}
