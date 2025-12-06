import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
export default function Service({ services }) {
  const { svgIcon, title, description } = services;
  return (
    <View className="px-[6%] border-b  border-[#E5E7EB] mt-[3%]">
      <View className="flex-row  gap-[2%]">
        <SvgXml xml={svgIcon} height={24} width={14} />
        <Text className="font-poppins-semiBold text-base text-[#1F2937] ">
          {title || "N/A"}
        </Text>
      </View>
      <View className="pt-[1%] pb-[2%] ">
        {services.subtitle && (
          <Text className="font-poppins-500medium text-base text-[#111827] ">
            {services.subtitle || "N/A"}
          </Text>
        )}
        <Text className="font-poppins pt-[0.5%] text-sm text-[#4B5563]">
          {description || "N/A"}
        </Text>
      </View>
    </View>
  );
}
