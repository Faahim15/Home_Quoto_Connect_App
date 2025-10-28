import React, { useState } from "react";
import { View, Text } from "react-native";
import OfferPrice from "./OfferPrice";
import { useDispatch, useSelector } from "react-redux";
import { setJobField } from "../../../../redux/features/jobPost/jobPostSlice";

const PriceSlider = () => {
  const dispatch = useDispatch();
  const priceRange = useSelector((state) => state.jobPost.priceRange);

  const handlePriceChange = (field, value) => {
    dispatch(
      setJobField({
        field: "priceRange",
        value: { ...priceRange, [field]: value },
      })
    );
  };

  return (
    <View className="mb-[2%]">
      <Text className="font-poppins-semiBold text-[#6B7280] text-base mb-[3%]">
        Price Range
      </Text>

      <View className="flex-row justify-between">
        {/* FROM */}
        <View className="flex-1 mr-[3%]">
          <Text className="font-poppins-500medium text-xs text-[#6B7280] mb-[2%]">
            From
          </Text>
          <OfferPrice
            value={priceRange.from}
            onChange={(val) => handlePriceChange("from", val)}
            verticalPadding={11}
          />
        </View>

        {/* TO */}
        <View className="flex-1 ml-[3%]">
          <Text className="font-poppins-500medium text-xs text-[#6B7280] mb-[2%]">
            To
          </Text>
          <OfferPrice
            value={priceRange.to}
            onChange={(val) => handlePriceChange("to", val)}
            verticalPadding={11}
          />
        </View>
      </View>
    </View>
  );
};

export default PriceSlider;
