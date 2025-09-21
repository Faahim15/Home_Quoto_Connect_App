import { Text, TouchableOpacity, View } from "react-native";
import HomeTopBar from "../../components/tabs/home/HomeTopBar";
import ServiceCards from "../../components/shared/services/ServiceCards";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import FilterModal from "../../components/provider/home/FilteringModal";
import ViewAllServiceCards from "../../components/tabs/home/services/ViewAllServices";
import ShowAllServiceCards from "../../components/tabs/home/services/provider/showAllServices";
export default function ContractorHomeScreen() {
  const [showModal, setShowModal] = useState(false);
  function modalCloseHanlder() {
    setShowModal(false);
  }
  return (
    <View className="flex-1 bg-white">
      <View>
        <HomeTopBar />
      </View>
      <View className="flex-row border-b border-[#f9f9f9]  justify-between px-[7%] mt-[3%] ">
        <Text className="font-poppins-semiBold text-base text-[#6B7280] ">
          Active Jobs
        </Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Ionicons name="options-outline" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View className="pb-[3%]">
        <ShowAllServiceCards />
      </View>
      <View>
        <FilterModal visible={showModal} onClose={modalCloseHanlder} />
      </View>
    </View>
  );
}
