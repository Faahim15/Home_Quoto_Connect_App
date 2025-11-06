import { FlatList, Image, View } from "react-native";
import imageData from "../../../../../data/shared/Images";
import { scale, verticalScale } from "../../../../../adaptive/Adaptiveness";

function showGallery({ item }) {
  return (
    <View className="border border-[#cacaca]">
      <Image
        style={{
          width: scale(160),
          height: verticalScale(195),
          borderRadius: scale(6),
        }}
        source={{ uri: item?.url || null }}
      />
    </View>
  );
}

export default function ViewAllGallery({ allImages }) {
  return (
    <View>
      <FlatList
        data={allImages || []}
        renderItem={showGallery}
        keyExtractor={(item, index) => item._id || index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ItemSeparatorComponent={() => (
          <View style={{ height: verticalScale(16) }} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(70) }}
      />
    </View>
  );
}
