import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { verticalScale } from "../../adaptive/Adaptiveness";
import { useState } from "react";
import { useGetSpecializationsQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";

export default function Specializations({ onChange }) {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const { data, isLoading } = useGetSpecializationsQuery();
  // console.log("specializations", data?.data?.specializations);

  const toggleSelection = (item) => {
    const isSelected = selectedIndexes.includes(item._id);
    const updatedIndexes = isSelected
      ? selectedIndexes.filter((i) => i !== item._id)
      : [...selectedIndexes, item._id];

    setSelectedIndexes(updatedIndexes);

    // ✅ Use selectedIndexes AFTER state update — or build from updatedIndexes directly
    const updatedSpecializations = isSelected
      ? selectedIndexes
          .filter((i) => i !== item._id)
          .map((id) => {
            const selectedItem = data?.data?.specializations.find(
              (spec) => spec._id === id
            );
            return selectedItem
              ? { id: selectedItem._id, title: selectedItem.title }
              : null;
          })
          .filter(Boolean)
      : [...selectedIndexes, item._id]
          .map((id) => {
            const selectedItem = data?.data?.specializations.find(
              (spec) => spec._id === id
            );
            return selectedItem
              ? { id: selectedItem._id, title: selectedItem.title }
              : null;
          })
          .filter(Boolean);

    // console.log("✅ updatedSpecializations", updatedSpecializations);
    onChange("specializations", updatedSpecializations);
  };

  const renderSpecialization = ({ item }) => {
    // console.log("tim", item?._id, index);
    const isSelected = selectedIndexes.includes(item?._id);
    // console.log("item", item);

    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item)}
        style={{
          height: verticalScale(35),
          marginRight: 8, // Add some horizontal spacing
        }}
        className={`border rounded-md border-[#D4E0EB] px-3 items-center justify-center ${isSelected ? "bg-[#319FCA]" : "bg-white"}`}
        key={item?._id}
      >
        <Text
          className={`font-poppins-500medium text-xs ${isSelected ? "text-white" : "text-[#175994]"}`}
        >
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mt-[3%]">
      <Text className="font-poppins-semiBold text-base text-[#6B7280]">
        Specializations
      </Text>
      <View className="mt-[3%]">
        <FlatList
          data={data?.data?.specializations}
          renderItem={renderSpecialization}
          keyExtractor={(item, i) => item?._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 4,
          }}
        />
      </View>
    </View>
  );
}
