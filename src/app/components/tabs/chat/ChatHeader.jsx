import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import ReportModal from "./ReportModal";
import { useState } from "react";
import { router } from "expo-router";
import { formatDateRelative } from "../../../util/helper-function";

const ChatHeader = ({ userData }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // console.log("show", userData);

  // console.log("userData", userData);

  const handleSelectProvider = (providerId) => {
    console.log("Selected provider:", providerId);
  };

  return (
    <View className="bg-white pt-[3%] pb-[1%] px-[4%] shadow-sm flex-row items-center">
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <Ionicons name="arrow-back" size={22} color="#000" />
      </TouchableOpacity>

      {userData?.profilePhoto ? (
        <Image
          source={{ uri: userData.profilePhoto }}
          style={{ width: scale(38), height: verticalScale(38) }}
          className="rounded-full mr-[3%]"
        />
      ) : (
        <View
          style={{ width: scale(38), height: verticalScale(38) }}
          className="rounded-full mr-[3%] bg-gray-300 items-center justify-center"
        >
          <Ionicons name="person" size={24} color="#6B7280" />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-gray-800 text-base font-poppins-500medium">
          {userData?.name?.split(" ").slice(0, 2).join(" ")}
        </Text>

        {userData?.isOnline ? (
          <Text className="text-gray-500 font-poppins-400regular text-sm">
            Active now
          </Text>
        ) : userData?.lastActive ? (
          <Text className="text-gray-500 font-poppins-400regular text-sm">
            {formatDateRelative(userData.lastActive)}
          </Text>
        ) : null}
      </View>

      <View className="flex-row">
        {/* <TouchableOpacity
          onPress={() => router.push("/chat/call")}
          className="mr-[8%]"
        >
          <View
            style={{ width: scale(24), height: verticalScale(24) }}
            className=" bg-[#319FCA] mt-[4%] rounded-full items-center justify-center"
          >
            <Ionicons name="call-outline" size={15} color="#fff" />
          </View>
        </TouchableOpacity> */}
        <ReportModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectProvider={handleSelectProvider}
          userData={userData}
        />

        {/* <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View
            style={{ width: scale(32), height: verticalScale(29) }}
            className="] items-center justify-center"
          >
            <Text className="text-[#6B7280] font-poppins-bold text-3xl">⋯</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ChatHeader;
