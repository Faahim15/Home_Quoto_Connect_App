import { View, Modal, Text, TouchableOpacity } from "react-native";

const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-[6%]">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-lg font-poppins-semiBold text-gray-900 text-center mb-2">
            Delete Job
          </Text>

          <Text className="text-base font-poppins-400regular text-gray-600 text-center mb-6">
            Are you sure you want to delete this job? This action cannot be
            undone.
          </Text>

          <View className="flex-row justify-between gap-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-200 rounded-xl py-3 px-4"
              onPress={onClose}
              disabled={isLoading}
            >
              <Text className="text-gray-700 text-base font-poppins-500medium text-center">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-red-500 rounded-xl py-3 px-4"
              onPress={onConfirm}
              disabled={isLoading}
            >
              <Text className="text-white text-base font-poppins-500medium text-center">
                {isLoading ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;
