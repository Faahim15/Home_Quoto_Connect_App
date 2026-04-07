import { Stack } from "expo-router";
import stackScreenOptions from "../../components/shared/layout/TitleStyle";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="myEarnings"
        options={{
        headerShown: false,
        }}
      />
      <Stack.Screen
        name="services"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="projectGalleryForm"
        options={{
          title: "Add Project",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="projectGallery"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
        headerShown: false,
        }}
      />
      <Stack.Screen
        name="subscription"
        options={{
         headerShown: false,
        }}
      />
      <Stack.Screen
        name="credits"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="buyCredits"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="subscriptionPayment"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
