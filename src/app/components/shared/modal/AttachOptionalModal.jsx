import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AttachOptionsModal({
  visible,
  onClose,
  onCamera,
  onGallery,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white w-64 rounded-2xl p-5">
          <Text className="text-lg font-semibold text-center mb-3">
            Select Option
          </Text>

          <TouchableOpacity
            onPress={() => {
              onClose();
              onCamera();
            }}
            className="flex-row items-center px-4 py-3 bg-gray-100 rounded-xl mb-2"
          >
            <Ionicons name="camera" size={22} color="#333" />
            <Text className="ml-3 text-base text-gray-700">Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onClose();
              onGallery();
            }}
            className="flex-row items-center px-4 py-3 bg-gray-100 rounded-xl mb-2"
          >
            <Ionicons name="image" size={22} color="#333" />
            <Text className="ml-3 text-base text-gray-700">Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="px-4 py-3 bg-red-100 rounded-xl mt-1"
          >
            <Text className="text-center text-red-600 font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
