import { View, Text } from "react-native";
import React from "react";
import ShowAllServiceCards from "../../components/tabs/home/services/provider/showAllServices";
import CustomTitle from "../../components/shared/CustomTitle";
import { useLocalSearchParams } from "expo-router";
export default function ShowAllJobs() {
  const { title } = useLocalSearchParams();
  return (
    <View className="flex-1  bg-[#f9f9f9] ">
      <View className="px-[6%]">
        <CustomTitle title={title} />
      </View>
      <ShowAllServiceCards horizontal={false} />
    </View>
  );
}
