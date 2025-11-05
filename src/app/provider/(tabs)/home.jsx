import { View, ScrollView, ActivityIndicator } from "react-native";
import HomeTopBar from "../../components/tabs/home/HomeTopBar";
import { useState, useEffect } from "react";
import FilterModal from "../../components/provider/home/FilteringModal";
import ShowAllServiceCards from "../../components/tabs/home/services/provider/showAllServices";
import SearchBar from "../../components/tabs/home/SearchBar";
import JobsHeader from "../../components/provider/home/JobsHeader";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import ServiceQuoteModal from "../../components/shared/modal/ServiceQuoteModal";
import { useUserProfileQuery } from "../../../redux/features/apiSlices/user/userApiSlices";
export default function ContractorHomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfileQuery();

  console.log("profile data:", profile);

  // ✅ Combined loading state
  if (profileLoading) {
    return (
      <View className="flex-1 bg-[#F9FAFB] justify-center items-center">
        <View className="flex-col items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#175994"
            style={{ marginBottom: 16 }}
          />
          <Text className="font-poppins-500medium text-base text-[#565656]">
            Loading...
          </Text>
        </View>
      </View>
    );
  }
  const userData = profile?.data?.user || null;
  function modalCloseHanlder() {
    setShowModal(false);
  }
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowQuoteModal(true);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: verticalScale(40),
        backgroundColor: "#f9f9f9",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-[#f9f9f9]">
        <View>
          <HomeTopBar userData={userData} />
        </View>
        <SearchBar onPress={() => setShowModal(true)} />

        <JobsHeader title="Todays Jobs" />
        <View className="pb-[0%]">
          <ShowAllServiceCards />
        </View>

        {/* Active jobs */}

        <JobsHeader title="Active Jobs" />
        <View className="">
          <ShowAllServiceCards />
        </View>

        <FilterModal visible={showModal} onClose={modalCloseHanlder} />
        <ServiceQuoteModal
          visible={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
        />
      </View>
    </ScrollView>
  );
}
