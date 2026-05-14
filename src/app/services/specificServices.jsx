import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import CustomTitle from "../components/shared/CustomTitle";
import popularSeviceData from "../components/data/shared/PopularServiceData";
import { LinearGradient } from "expo-linear-gradient";

export default function SpecificServices() {
  const { serviceId } = useLocalSearchParams();
  const service = popularSeviceData.find(
    (service) => service.id.toString() === serviceId,
  );

  const ServiceCard = ({ item }) => {
    return (
      <Pressable
        activeOpacity={0.8}
        className="bg-[#f9f9f9] rounded-2xl overflow-hidden shadow-sm"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="relative">
          {/* Image Container with Gradient Overlay */}
          <View className="relative h-48 bg-gray-100">
            <Image
              source={{ uri: item.img }}
              resizeMode="cover"
              className="w-full h-full"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.3)"]}
              className="absolute bottom-0 left-0 right-0 h-20"
            />
          </View>

          {/* Service Name with Badge Style */}
          <View className="absolute bottom-3 left-3 right-3">
            <View className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl">
              <Text className="font-poppins-semiBold text-base text-gray-900">
                {item.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Footer */}
        {/* <View className="px-4 py-3 bg-gray-50/50 border-t border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-500 font-poppins">
              Tap to view details
            </Text>
            <View className="bg-blue-500 w-6 h-6 rounded-full items-center justify-center">
              <Text className="text-white text-xs">→</Text>
            </View>
          </View>
        </View> */}
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <CustomTitle title="Popular Services" withSafeTop={true} />
      <View className="px-6 pt-2">{/* Service Category Header */}</View>

      <FlatList
        data={service?.data || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ServiceCard item={item} />}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 24,
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
