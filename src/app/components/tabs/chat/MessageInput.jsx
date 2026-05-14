import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MessageInput = ({
  newMessage,
  setNewMessage,
  selectedMedia,
  removeSelectedMedia,
  showMediaModal,
  setShowMediaModal,
  selectFromLibrary,
  takePhoto,
  sendMessage,
  handleTypingStart,
  handleTypingStop,
}) => {
  const insets = useSafeAreaInsets();

  const MediaModal = () => (
    <Modal
      visible={showMediaModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowMediaModal(false)}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        activeOpacity={1}
        onPress={() => setShowMediaModal(false)}
      >
        <View className="bg-white rounded-t-3xl p-6">
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

          <Text className="text-lg font-poppins-500medium text-gray-800 mb-4 text-center">
            Select Photo
          </Text>

          <View className="space-y-3">
            <Pressable
              onPress={selectFromLibrary}
              className="flex-row items-center p-4 bg-gray-50 rounded-xl"
            >
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="images-outline" size={24} color="#319FCA" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-poppins-500medium">
                  Photo Library
                </Text>
                <Text className="text-gray-500 font-poppins-400regular text-xs">
                  Choose from your gallery
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={takePhoto}
              className="flex-row items-center p-4 bg-gray-50 rounded-xl"
            >
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="camera-outline" size={24} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-poppins-500medium">
                  Take Photo
                </Text>
                <Text className="text-gray-500 font-poppins-400regular text-xs">
                  Capture with camera
                </Text>
              </View>
            </Pressable>
          </View>

          <Pressable
            onPress={() => setShowMediaModal(false)}
            className="mt-6 p-4 bg-gray-100 rounded-xl"
          >
            <Text className="text-gray-600 text-center font-poppins-400regular">
              Cancel
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={{ paddingBottom: Platform.OS === "ios" ? insets.bottom : 15 }}>
      {/* Selected Media Preview */}
      {selectedMedia && selectedMedia.length > 0 && (
        <View className="px-[4%] pb-2 bg-white">
          <View className="bg-gray-100 rounded-xl p-3">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-700 font-poppins-500medium">
                Selected Photos ({selectedMedia.length})
              </Text>
              <Pressable onPress={() => removeSelectedMedia()} className="p-1">
                <Ionicons name="close-circle" size={20} color="#EF4444" />
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {selectedMedia.map((media, index) => (
                  <View key={index} className="relative mr-2">
                    <Pressable
                      onPress={() => removeSelectedMedia(index)}
                      className="absolute top-1 right-1 z-10 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                    >
                      <Ionicons name="close" size={12} color="white" />
                    </Pressable>

                    <Image
                      source={{ uri: media.uri }}
                      className="w-16 h-16 rounded-lg"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      <MediaModal />

      {/* Message Input */}
      <View className="bg-white px-[3.3%] py-[3%] flex-row items-center gap-[3%] border-t border-gray-100">
        <View className="flex-1 border bg-white border-[#C3DBFF] rounded-3xl flex-row items-center px-[4%] py-[2.5%]">
          <TextInput
            value={newMessage}
            onChangeText={(text) => {
              setNewMessage(text);
              handleTypingStart();
            }}
            placeholder="Type something..."
            placeholderTextColor="#898989"
            className="flex-1 font-poppins-400regular px-[3%] text-black text-sm"
            style={{ minHeight: 40, maxHeight: 100 }}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            onFocus={handleTypingStart}
            onBlur={handleTypingStop}
          />

          <Pressable onPress={() => setShowMediaModal(true)}>
            <View
              style={{ width: scale(24), height: verticalScale(24) }}
              className="rounded items-center justify-center"
            >
              <Ionicons name="image-outline" size={24} color="#1A73E8" />
            </View>
          </Pressable>
        </View>

        <Pressable
          onPress={sendMessage}
          style={{ width: scale(42), height: verticalScale(42) }}
          className={`border border-[#C3DBFF] rounded-md items-center justify-center ${
            newMessage.trim() || (selectedMedia && selectedMedia.length > 0)
              ? "bg-[#1A73E8]"
              : "bg-white"
          }`}
        >
          <Ionicons
            name="send-outline"
            size={24}
            color={
              newMessage.trim() || (selectedMedia && selectedMedia.length > 0)
                ? "#fff"
                : "#1A73E8"
            }
            style={{ transform: [{ rotate: "-50deg" }] }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default MessageInput;
