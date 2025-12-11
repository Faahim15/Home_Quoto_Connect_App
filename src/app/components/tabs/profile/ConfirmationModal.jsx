import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

export default function ConfirmationModal({
  visible,
  onClose,
  title,
  yesText = "Yes",
  noText = "No",
  onYes,
  onNo,
  isLoading,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl w-[85%] mx-[7.5%]">
          <View className="px-[6%] py-[8%]">
            <Text className="text-lg font-poppins-500medium text-gray-800 text-center mb-[8%]">
              {title}
            </Text>

            <View className="flex-row justify-center ">
              <TouchableOpacity
                onPress={onYes}
                disabled={isLoading}
                style={{ width: scale(120), height: verticalScale(40) }}
                className={`bg-white border justify-center items-center  border-[#EF4444] py-3 px-6 rounded-lg ${isLoading ? "opacity-50" : ""}`}
              >
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#EF4444" />
                  </View>
                ) : (
                  <Text className="text-[#EF4444] text-sm font-poppins-semiBold">
                    {yesText}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onNo}
                style={{ width: scale(120), height: verticalScale(40) }}
                className="ml-[3%] justify-center items-center  bg-[#0065FF] rounded-lg"
              >
                <Text className="text-white text-sm font-poppins-semiBold text-center">
                  {noText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
