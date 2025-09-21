import { View, Text, ScrollView } from "react-native";
import HomeTopBar from "../components/tabs/home/HomeTopBar";
import PromoCard from "../components/tabs/home/PromoCard";
import ServiceCards from "../components/shared/services/ServiceCards";
import PopularServices from "../components/tabs/home/services/PopulareServices";
import ServiceProvider from "../components/tabs/home/services/ServiceProvider";
import ServiceHeader from "../components/tabs/home/ServiceHeader";

export default function HomeScreen() {
  return (
    <View className="flex-1  bg-[#F9FAFB]">
      <HomeTopBar />

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
