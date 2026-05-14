import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
const PaymentMethodCard = ({
  id,
  title,
  icon,
  iconColor,
  iconBackgroundColor,
  isSelected,
  onPress,
}) => {
  return (
    <Pressable
      onPress={() => onPress(id)}
      className={`w-full p-[4%] rounded-lg mb-[3%] border-2 flex-row items-center justify-between ${
        isSelected ? "border-[#319FCA] bg-blue-50" : "border-gray-200 bg-white"
      }`}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center flex-1">
        {/* Payment Method Icon */}
        <View
          className="rounded-lg items-center justify-center mr-[4%]"
          style={{
            backgroundColor: iconBackgroundColor,
            width: scale(40),
            height: verticalScale(40),
          }}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>

        {/* Payment Method Title */}
        <Text className="text-base font-poppins-500medium text-[#565656]">
          {title}
        </Text>
      </View>

      {/* Selection Indicator */}
      {isSelected && <Ionicons name="checkmark" size={20} color="#3B82F6" />}
    </Pressable>
  );
};

// Reusable Add New Card Button Component
export const AddNewCardButton = ({ onPress, title = "Add new card" }) => {
  return (
    <Pressable
      onPress={onPress}
      className="w-full p-[4%] rounded-lg border-2 border-[#319FCA] bg-white items-center justify-center"
      activeOpacity={0.8}
    >
      <View className="flex-row items-center">
        <Ionicons name="add" size={24} color="#319FCA" />
        <Text className="text-[#319FCA] font-poppins-bold text-base ml-[2%]">
          {title}
        </Text>
      </View>
    </Pressable>
  );
};
export default PaymentMethodCard;
