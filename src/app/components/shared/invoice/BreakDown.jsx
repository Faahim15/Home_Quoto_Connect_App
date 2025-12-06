import { View, Text } from "react-native";
import React from "react";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

export default function BreakDown({
  title,
  price,
  color = "#4B5563",
  bgColor,
}) {
  return (
    <View className="flex-row justify-between">
      <Text className="font-poppins text-sm text-[#4B5563] ">{title}</Text>
      <Text
        style={[
          { color },
          bgColor
            ? {
                backgroundColor: bgColor,
                paddingHorizontal: scale(2),
                borderWidth: scale(1),
                borderRadius: scale(6),
                paddingVertical: verticalScale(2),
                borderColor: bgColor,
              }
            : undefined,
        ]}
        className="font-poppins text-sm text-[#111827]"
      >
        {`${
          price === "cash"
            ? "Cash"
            : price === "card"
              ? "Card"
              : price === "Paid in Full"
                ? "Paid in Full"
                : String(price).includes("%")
                  ? price
                  : `$${price}`
        }` || ""}
      </Text>
    </View>
  );
}
