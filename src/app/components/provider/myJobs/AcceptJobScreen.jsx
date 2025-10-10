import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import PaymentChecklist from "../../tabs/jobs/PaymentCheckList";
import { acceptJobData } from "../../data/provider/MyJobsData";
import { useCallback } from "react";
import { router } from "expo-router";
const ServiceCard = ({ item }) => {
  const handlePress = useCallback(() => {
    router.push({
      pathname: "/provider/myJobs/acceptJobs",
      params: { serviceId: item.id, showButtons: "yes" },
    });
  }, [item]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ width: scale(327), height: "full" }}
      className="bg-white pb-[2%] mr-[0.5%] flex-col justify-center  border border-[#D4E0EB] px-[4.5%]  rounded-xl shadow-sm overflow-hidden"
    >
      <View className="flex-row mt-[2%] ">
        {/* User Image */}
        <View className="">
          <Image
            source={{ uri: item.authorImage }}
            style={{ width: scale(48), height: verticalScale(48) }}
            className="mt-[12%] bg-gray-300 rounded-full mr-[2%]"
          />
        </View>

        {/* Card Content */}
        <View className=" ">
          {/* Title */}
          <Text
            className="text-gray-900 font-poppins-500medium text-base mt-[2%] "
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* Author */}
          <View className="flex-row items-center mt-[2%]">
            <Text className="font-poppins-400regular text-sm">
              by{" "}
              <Text className="font-poppins-400regular text-[#319FCA] text-sm ">
                {item.author}
              </Text>
            </Text>
          </View>

          {/* Service Type */}
          <View className="flex-row gap-[2%] items-center mt-[2%]">
            <Ionicons name="construct-outline" size={16} color="#6B7280" />
            <Text className="font-poppins-400regular text-sm text-[#6B7280] ">
              {item.service}
            </Text>
          </View>

          {/* Location and Time */}
          <View className="flex-row items-center mt-[2%]">
            <Ionicons name="location-outline" size={16} color="#319FCA" />
            <Text className="text-gray-500 text-sm ml-[1%]"></Text>

            <Text className="font-poppins-400regular text-sm text-[#319FCA] ">
              {item.location}{" "}
              <Text className="text-[#6B7280]">| {item.time}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Price section */}

      <View className="flex-row mt-[2%] justify-between">
        <Text className="font-poppins-400regular text-base text-[#1F2937] ">
          Price
        </Text>
        <Text className="font-poppins-semiBold text-lg text-[#F59E0B] ">
          {item.price}
        </Text>
      </View>
      {/* Status section */}

      <View className="flex-row mt-[2%] justify-between">
        <Text className="font-poppins-400regular text-base text-[#1F2937] ">
          status
        </Text>
        <Text
          className={`font-poppins-400regular text-base ${item.status === "In Progress" ? "text-[#1A73E8]" : item.status === "Completed" ? "text-[#00BFA5]" : "text-[#D32F2F]"} `}
        >
          {item.status}
        </Text>
      </View>

      {/* Job and payment confirmation section */}

      {item.status === "Completed" && (
        <View className="py-[2%]  bg-[#F5F5F5] rounded-lg ">
          <PaymentChecklist />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function AcceptJobsScreen() {
  return (
    <View className={`  justify-center items-center  bg-[#f9f9f9] mt-[4%]`}>
      <FlatList
        data={acceptJobData}
        renderItem={({ item }) => <ServiceCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(100),
          rowGap: verticalScale(12),
        }}
        snapToAlignment="start" // Ensures proper snapping alignment
      />
    </View>
  );
}
