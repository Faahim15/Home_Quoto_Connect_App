import { View, Text, FlatList } from "react-native";
import { verticalScale } from "../../../../../adaptive/Adaptiveness";

export default function Skills({ title = "Skills", specializations }) {
  const renderSpecialization = ({ item }) => {
    return (
      <View
        style={{
          height: verticalScale(35),
          marginRight: 8,
        }}
        className="border rounded-md border-[#D4E0EB] px-3 items-center justify-center bg-white"
      >
        <Text className="font-poppins-500medium text-xs text-[#565656]">
          {item.title}
        </Text>
      </View>
    );
  };

  const hasSpecializations =
    Array.isArray(specializations) && specializations.length > 0;

  return (
    <View className="mx-[6%] mt-[3%]">
      <Text className="font-poppins-semiBold text-base text-[#565656]">
        {title}
      </Text>

      <View className="flex-row flex-wrap gap-[2%] mt-[2%]">
        {hasSpecializations ? (
          <FlatList
            data={specializations}
            renderItem={renderSpecialization}
            keyExtractor={(item) => item._id?.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 4,
            }}
          />
        ) : (
          <Text className="font-poppins-500medium text-xs text-gray-400 ">
            No skills available.
          </Text>
        )}
      </View>
    </View>
  );
}
