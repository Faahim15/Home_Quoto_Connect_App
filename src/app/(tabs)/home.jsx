import { View, ScrollView } from "react-native";
import HomeTopBar from "../components/tabs/home/HomeTopBar";
import PromoCard from "../components/tabs/home/PromoCard";
import ServiceCards from "../components/shared/services/ServiceCards";
import PopularServices from "../components/tabs/home/services/PopulareServices";
import ServiceProvider from "../components/tabs/home/services/ServiceProvider";
import ServiceHeader from "../components/tabs/home/ServiceHeader";
import { useUserProfileQuery } from "../../redux/features/apiSlices/user/userApiSlices";
import { Text } from "react-native";

export default function HomeScreen() {
  const { data: profile, isLoading, error } = useUserProfileQuery();
  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading profile</Text>
      </View>
    );
  }

  const userData = profile?.data?.user;
  // console.log("data user", location, fullName);

  return (
    <View className="flex-1  bg-[#F9FAFB]">
      <HomeTopBar userData={userData} />

      <ScrollView className="flex-1 h-full">
        <PromoCard />
        {/* Today's Jobs section starts here */}
        <ServiceHeader title="Today's Jobs" />
        <ServiceCards showPrice={true} showAddress={true} />

        {/* Today's  Jobs section ends here */}

        {/* Active Jobs section starts here */}

        <ServiceHeader title="Active Jobs" />
        <ServiceCards showPrice={true} showAddress={true} />
        {/* Active Jobs section ends here */}

        {/* popular service  */}
        <PopularServices />

        {/* Popular Service Provider section */}
        <ServiceProvider />
      </ScrollView>
    </View>
  );
}
