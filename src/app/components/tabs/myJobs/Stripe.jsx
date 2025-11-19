import { View, Text } from "react-native";
import CustomTitle from "../../shared/services/CustomTitle";

export default function Stripe() {
  return (
    <View className="px-[6%] py-[4%]">
      <CustomTitle title="Payment" />
      {/* Header */}
      <Text className="font-poppins-semiBold text-gray-700 text-base mb-[3%]">
        Payment Method
      </Text>

      {/* Stripe Payment Option */}
      <View
        className="border border-gray-200 rounded-lg px-[4%] py-[3.5%] flex-row items-center justify-between"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center flex-1">
          {/* Radio Button */}
          <View className="w-[20px] h-[20px] rounded-full border-2 border-gray-800 mr-[3%] items-center justify-center">
            <View className="w-[10px] h-[10px] rounded-full bg-gray-800" />
          </View>

          {/* Gateway Name */}
          <Text className="text-gray-800 text-base font-medium">Stripe</Text>
        </View>

        {/* Stripe Logo Text */}
        <Text className="text-[#635BFF] text-lg font-bold">stripe</Text>
      </View>
    </View>
  );
}
