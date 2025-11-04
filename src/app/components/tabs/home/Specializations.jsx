import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { verticalScale } from "../../adaptive/Adaptiveness";
import { useState } from "react";
import { useGetSpecializationsQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";

export default function Specializations({ onChange }) {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const { data, isLoading } = useGetSpecializationsQuery();

  const toggleSelection = (item) => {
    const isSelected = selectedIndexes.includes(item._id);
    const updatedIndexes = isSelected
      ? selectedIndexes.filter((i) => i !== item._id)
      : [...selectedIndexes, item._id];

    setSelectedIndexes(updatedIndexes);

    const updatedSpecializations = updatedIndexes
      .map((id) => {
        const selectedItem = data?.data?.specializations.find(
          (spec) => spec._id === id
        );
        return selectedItem
          ? { id: selectedItem._id, title: selectedItem.title }
          : null;
      })
      .filter(Boolean);

    onChange("specializations", updatedSpecializations);
  };

  const renderSpecialization = ({ item }) => {
    const isSelected = selectedIndexes.includes(item._id);

    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item)}
        style={{
          height: verticalScale(35),
          marginRight: 8,
        }}
        className={`border rounded-md border-[#D4E0EB] px-3 items-center justify-center ${isSelected ? "bg-[#319FCA]" : "bg-white"}`}
        key={item._id}
      >
        <Text
          className={`font-poppins-500medium text-xs ${isSelected ? "text-white" : "text-[#175994]"}`}
        >
          {item.title}
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
        {isLoading ? (
          <View className="py-4 items-center justify-center">
            <ActivityIndicator size="small" color="#319FCA" />
          </View>
        ) : (
          <FlatList
            data={data?.data?.specializations}
            renderItem={renderSpecialization}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 4,
            }}
          />
        )}
      </View>
    </View>
  );
}
