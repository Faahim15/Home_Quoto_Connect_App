import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { scale } from "../../adaptive/Adaptiveness";

export default function CashConfirmModal({ visible, onConfirm, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View
          className="bg-white rounded-2xl p-6 w-full"
          style={{ paddingVertical: scale(20) }}
        >
          <Text className="text-xl font-poppins-600semiBold text-center mb-4">
            Confirm Cash Payment
          </Text>

          <Text className="text-gray-700 font-poppins-400regular text-center mb-6">
            Are you sure you want to confirm this cash payment?
          </Text>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-300 py-3 px-5 rounded-xl w-[45%]"
            >
              <Text className="text-center font-poppins-500medium text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="bg-[#10B981] py-3 px-5 rounded-xl w-[45%]"
            >
              <Text className="text-center font-poppins-500medium text-white">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
