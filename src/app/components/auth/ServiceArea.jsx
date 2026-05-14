import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { verticalScale } from "../adaptive/Adaptiveness";
import { useDispatch, useSelector } from "react-redux";
import { setProviderRegister } from "../../../redux/features/provider/providerSlice";

const CANADIAN_PROVINCES = [
  { id: "AB", name: "Alberta" },
  { id: "BC", name: "British Columbia" },
  { id: "MB", name: "Manitoba" },
  { id: "NB", name: "New Brunswick" },
  { id: "NL", name: "Newfoundland and Labrador" },
  { id: "NS", name: "Nova Scotia" },
  { id: "ON", name: "Ontario" },
  { id: "PE", name: "Prince Edward Island" },
  { id: "QC", name: "Quebec" },
  { id: "SK", name: "Saskatchewan" },
  { id: "NT", name: "Northwest Territories" },
  { id: "NU", name: "Nunavut" },
  { id: "YT", name: "Yukon" },
];

export default function ServiceAreaSelector() {
  const dispatch = useDispatch();
  const registrationData = useSelector((state) => state.providerRegister);
  const selectedAreas = registrationData?.serviceArea || [];

  const toggleArea = (province) => {
    let updatedAreas;

    if (selectedAreas.some((area) => area.id === province.id)) {
      updatedAreas = selectedAreas.filter((area) => area.id !== province.id);
    } else {
      updatedAreas = [...selectedAreas, province];
    }

    dispatch(
      setProviderRegister({ field: "serviceArea", value: updatedAreas }),
    );
  };

  const renderArea = ({ item }) => {
    const isSelected = selectedAreas.some((area) => area.id === item.id);

    return (
      <Pressable
        activeOpacity={1}
        style={{ height: verticalScale(35), marginRight: 8 }}
        onPress={() => toggleArea(item)}
        className={`border rounded-md border-[#D4E0EB] px-3 items-center justify-center ${
          isSelected ? "bg-[#319FCA]" : "bg-white"
        }`}
      >
        <Text
          className={`font-poppins-500medium text-xs ${
            isSelected ? "text-white" : "text-[#175994]"
          }`}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View className="mt-[3%]">
      <Text className="font-poppins-semiBold text-base text-[#6B7280]">
        Service Areas
      </Text>
      <FlatList
        data={CANADIAN_PROVINCES}
        renderItem={renderArea}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      />
    </View>
  );
}
