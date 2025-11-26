import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

const BottomStatusPanel = ({
  isOnline,
  isLoadingJobs,
  nearbyJobsCount,
  userLocation,
  onToggleOnline,
}) => {
  return (
    <View className="w-full bg-white border-t border-gray-100">
      <View className="items-center py-4">
        <Text className="text-base font-poppins-500medium text-gray-900">
          {isOnline ? "You're online" : "You're offline"}
        </Text>
        {userLocation && (
          <Text className="text-sm font-poppins-400regular text-gray-500 mt-1">
            {isLoadingJobs
              ? "Loading nearby jobs..."
              : `${nearbyJobsCount} jobs nearby`}
          </Text>
        )}
      </View>

      <View className="flex-row items-center justify-between px-[3%] pb-[3%]">
        <View className="w-[10%]"></View>
        <TouchableOpacity
          style={{ height: verticalScale(44) }}
          onPress={onToggleOnline}
          className={`flex-1 mx-[3%] rounded-full items-center justify-center ${
            isOnline ? "bg-red-500" : "bg-cyan-500"
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-poppins-500medium text-base">
            {isOnline ? "Go Offline" : "Go Online"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ width: scale(40), height: verticalScale(40) }}
          className="rounded-full border border-[#666] items-center justify-center"
        >
          <Ionicons name="options-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomStatusPanel;
