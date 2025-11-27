import { View, Text } from "react-native";

export default function FilterHeader({ title, count }) {
  return (
    <View className="flex-row justify-between items-center mt-[6%] mx-[6%]">
      <View className="flex-row items-center">
        <Text className="font-poppins-semiBold text-base text-[#6B7280]">
          {title}
        </Text>

        {/* Count Badge */}
        {count !== undefined && (
          <View className="ml-2 bg-[#E5F2FF] px-2 py-[1] rounded-md">
            <Text className="font-poppins-medium text-xs text-[#18649F]">
              {count}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
