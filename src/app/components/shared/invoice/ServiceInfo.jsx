import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { callIcon, gmailIcon } from "../../../../../assets/svg/icons";

//  svgIcon: avatar1,
//       name: "John Doe",
//       role: "Service Provider",
//       serviceType: "Plumbing Services",
//       address: "123 Main Street, Toronto, ON M5V 2T6",
//       phone: "(416) 555-0123",
//       gmail: "john@doeplumbing.com",

export default function ServiceInfo({ serviceDetails }) {
  const { role, name, address, phone, gmail, svgIcon } = serviceDetails;
  return (
    <View className="border-b  border-[#E5E7EB] px-[6%] mt-[3%]">
      <View className="flex-row gap-[2%]">
        <SvgXml xml={svgIcon} height={24} width={14} />
        <Text className="font-poppins-semiBold text-base text-[#1F2937] ">
          {role || "N/A"}
        </Text>
      </View>
      {/* details */}

      <View className="pt-[0.7%] gap-[2%] ">
        <Text className="font-poppins-500medium text-base text-[#111827] ">
          {name || "N/A"}
        </Text>
        {serviceDetails.serviceType && (
          <Text className="font-poppins text-sm text-[#111827] ">
            {serviceDetails.serviceType || "N/A"}
          </Text>
        )}
        <View>
          <Text className="font-poppins text-sm text-[#4B5563]">
            {address || "N/A"}
          </Text>
          {/* call */}
          <View className="flex-row gap-[2%]">
            <SvgXml xml={callIcon} height={16} width={12} />
            <Text className="font-poppins text-sm text-[#4B5563]">
              {phone || "N/A"}
            </Text>
          </View>
          {/* gamil */}
          <View className="flex-row gap-[2%]">
            <SvgXml xml={gmailIcon} height={16} width={12} />
            <Text className="font-poppins text-sm text-[#4B5563]">
              {gmail || "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
