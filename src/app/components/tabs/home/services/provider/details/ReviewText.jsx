import { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default function ReviewText({ text }) {
  const [expanded, setExpanded] = useState(false);
  const wordLimit = 20;

  const words = text.split(" ");
  const preview = words.slice(0, wordLimit).join(" ") + "...";

  const shouldTruncate = words.length > wordLimit;

  return (
    <View className="mt-[2%]">
      <Text className="font-poppins-500medium text-justify text-xs text-[#565656]">
        {expanded || !shouldTruncate ? text : preview}
      </Text>

      {shouldTruncate && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text className="text-[#175994] text-xs mt-1 font-poppins-500medium">
            {expanded ? "Read less" : "Read more"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
