import { Stack } from "expo-router";
import stackScreenOptions from "../../components/shared/layout/TitleStyle";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="myEarnings"
        options={{
          title: "My Earnings",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="services"
        options={{
          title: "Sevices",
          ...stackScreenOptions,
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
          title: "Project Gallery",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          title: "Stripe Payment",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="subscription"
        options={{
          title: "Subscription",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="credits"
        options={{
          title: "Credits",
          ...stackScreenOptions,
        }}
      />
      <Stack.Screen
        name="buyCredits"
        options={{
          title: "Buy Credits",
          ...stackScreenOptions,
        }}
      />
    </Stack>
  );
}
