import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import { router } from "expo-router";
import { useGetChatsQuery } from "../../../redux/features/apiSlices/chat/chatApiSlices";
import { formatDateRelative } from "../../util/helper-function";
const MessagesScreen = () => {
  const { data, isLoading, error } = useGetChatsQuery();

  const [messages, setMessages] = useState([]);

  // Mark message as read
  const markMessageAsRead = (messageId) => {
    // navigation.navigate("ChatScreen");
    router.push("/chat/displayChat");
  };

  const renderMessageItem = ({ item }) => {
    console.log(
      "this is from renderMessageItem",
      item?.lastMessage?.content?.text
    );
    const clientParticipant = item?.participants?.find(
      (p) => p?.role === "client"
    );

    const lastMessage = item?.lastMessage?.content?.text;
    const isRead = item?.lastMessage?.isRead;
    const isActive = clientParticipant?.user?.isOnline;

    console.log(isRead);
    // console.log(clientParticipant?.user, "show");
    const profilePhotoUrl = clientParticipant?.user?.profilePhoto?.url ?? null;

    return (
      <TouchableOpacity
        className="w-full mb-[4%] px-[4%]"
        // onPress={() => markMessageAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View
          className={` border  py-[3%] rounded-lg px-[3%] flex-row items-center ${item.isRead ? "bg-[#D1E8F1] border-[#D1E8F1] " : "bg-white"} border-[#d5d5d5] `}
        >
          {/* Avatar */}
          <View className="mr-3">
            <Image
              source={{ uri: profilePhotoUrl || null }}
              className="w-10 h-10 rounded-full"
              defaultSource={{ uri: "https://via.placeholder.com/40" }}
            />
            {/* Active Status Indicator */}
            {isActive && (
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-[#44B700] rounded-full border-2 border-white" />
            )}
          </View>

          {/* Message Content */}
          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-[1%]">
              <Text className="text-[#333333] font-poppins-500medium text-base">
                {clientParticipant?.user?.fullName || "N/A"}
              </Text>
              <Text className="text-black font-poppins-400regular text-xs">
                {formatDateRelative(item?.lastMessage?.updatedAt) || "N/A"}
              </Text>
            </View>
            <Text
              className={` font-poppins-400regular text-xs ${isRead ? "text-[#767676]" : "text-[#111]"} `}
            >
              {lastMessage || "N/A"}
            </Text>
          </View>

          {/* Read Status */}
          <View className="ml-[2%]">
            {isRead ? (
              <View className="w-4 h-4 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs">✓</Text>
              </View>
            ) : (
              <View className="w-4 h-4 bg-gray-300 rounded-full" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="bg-[#f9fafb] justify-center items-center py-[3%] ">
        <View className="flex-row justify-between items-center">
          <Text className="text-[#333333] text-center text-xl font-poppins-500medium ">
            Messages
          </Text>
        </View>
      </View>

      {/* Loading State */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0066CC" />
          <Text className="text-[#767676] font-poppins-400regular text-sm mt-3">
            Loading messages...
          </Text>
        </View>
      ) : data?.data?.chats?.length === 0 ? (
        /* Empty State */
        <View className="flex-1 justify-center items-center px-[10%]">
          <Text className="text-6xl mb-4">💬</Text>
          <Text className="text-[#333333] font-poppins-500medium text-lg text-center mb-2">
            No Messages Yet
          </Text>
          <Text className="text-[#767676] font-poppins-400regular text-sm text-center">
            When you start a conversation, your messages will appear here
          </Text>
        </View>
      ) : (
        /* Messages List */
        <FlatList
          data={data?.data?.chats}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => item?._id || index.toString()}
          contentContainerStyle={{
            paddingVertical: verticalScale(16),
          }}
          showsVerticalScrollIndicator={false}
          refreshing={false}
          onRefresh={() => {
            // Implement refresh logic here
          }}
        />
      )}
    </View>
  );
};

export default MessagesScreen;
