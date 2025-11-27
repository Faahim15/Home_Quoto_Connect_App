import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
export default function JobsHeader({ title }) {
  return (
    <View className="flex-row justify-between mt-[6%] mx-[6%]">
      <Text className="font-poppins-semiBold text-base text-[#6B7280] ">
        {title}
      </Text>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/services/showAllJobs",
            params: { title: title, showButtons: true },
          })
        }
      >
        <Text className="font-poppins-semiBold text-base text-[#18649F] ">
          View all
        </Text>
      </TouchableOpacity>
    </View>
  );
}
