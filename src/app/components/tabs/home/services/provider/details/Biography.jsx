import { View, Text } from "react-native";
export default function Biography({ bio }) {
  return (
    <View className="mt-[3%] mx-[6%] ">
      <Text className="font-poppins-semiBold text-base mt-[2%] text-[#565656]">
        Bio
      </Text>
      <Text className="font-poppins-500medium text-xs text-justify text-[#565656]">
        {bio || "N/A"}
      </Text>
    </View>
  );
}
