// components/tabs/profile/DeleteAccountModal.js
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { useState } from "react";
import PasswordField from "../../auth/PasswordField";

export default function DeleteAccountModal({
  visible,
  onClose,
  onDelete,
  isLoading,
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleDelete = () => {
    if (!password) {
      setError("Please enter your current password");
      return;
    }
    onDelete(password);
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (error) setError(""); // Clear error when user starts typing
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 mx-4 w-11/12">
          <Text className="font-poppins-semiBold text-lg text-[#333333] mb-2 text-center">
            Delete Your Account?
          </Text>

          <Text className="font-poppins-400regular text-sm text-[#666666] mb-4 text-center">
            This action is permanent and cannot be undone. All your data will be
            erased.
          </Text>

          {/* Password Field Component */}
          <PasswordField
            label="Current Password"
            placeholder="Enter your current password"
            error={error}
            onChangeText={handlePasswordChange}
            value={password}
          />

          <View className="flex-row justify-between mt-2">
            <Pressable
              onPress={handleClose}
              className="flex-1 mr-2 border border-gray-300 rounded-xl py-4"
              disabled={isLoading}
            >
              <Text className="text-center font-poppins-500medium text-[#333333]">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              disabled={!password || isLoading}
              className="flex-1 ml-2 bg-[#D7263D] rounded-xl py-4"
              style={{ opacity: !password || isLoading ? 0.6 : 1 }}
            >
              <Text className="text-center font-poppins-500medium text-white">
                {isLoading ? "Deleting..." : "Delete Account"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
