import {
  View,
  FlatList,
  Image,
  Pressable,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { scale, verticalScale } from "../../../../../adaptive/Adaptiveness";
import { useState } from "react";

export default function Gallery({ portfolioImages }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const allImages = portfolioImages?.flatMap((item) => item.images);

  // console.log("this from gallery:", allImages[0].url);

  const handlePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };
  return (
    <View className="flex-row  mt-[3%] mx-[6%]">
      <FlatList
        data={allImages || []}
        horizontal
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handlePress(item?.url)}
            className="mr-[2%] border border-[#cacaca]"
          >
            <Image
              source={{
                uri: item?.url,
              }}
              style={{
                width: scale(100),
                height: verticalScale(121),
                borderRadius: scale(4),
              }}
              resizeMode="cover"
            />
          </Pressable>
        )}
        contentContainerStyle={{ paddingRight: scale(100) }}
      />
      {/* Modal for full-screen image view */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/70"
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: selectedImage }}
            className="w-[90%] h-[50%] rounded-xl"
            resizeMode="contain"
          />
          <Text className="text-white mt-4 text-sm">Tap to close</Text>
        </Pressable>
      </Modal>
    </View>
  );
}
