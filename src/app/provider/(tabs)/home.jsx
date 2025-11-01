import { View, ScrollView } from "react-native";
import HomeTopBar from "../../components/tabs/home/HomeTopBar";
import { useState, useEffect } from "react";
import FilterModal from "../../components/provider/home/FilteringModal";
import ShowAllServiceCards from "../../components/tabs/home/services/provider/showAllServices";
import SearchBar from "../../components/tabs/home/SearchBar";
import JobsHeader from "../../components/provider/home/JobsHeader";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import ServiceQuoteModal from "../../components/shared/modal/ServiceQuoteModal";
export default function ContractorHomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  function modalCloseHanlder() {
    setShowModal(false);
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQuoteModal(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: verticalScale(40),
        backgroundColor: "#f9f9f9",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-[#f9f9f9]">
        {/* <View>
          <HomeTopBar />
        </View> */}
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
