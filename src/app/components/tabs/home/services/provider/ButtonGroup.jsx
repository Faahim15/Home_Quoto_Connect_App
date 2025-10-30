import { View } from "react-native";
import SingleButton from "./SingleButton";
import { useState } from "react";

export default function ButtonGroup({ handleInputChange }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const titles = ["urgent", "asap", "next_week"];
  return (
    <View>
      {/* Button Selection */}
      {titles.map((title, index) => (
        <SingleButton
          key={index}
          title={title}
          selected={activeIndex === index}
          handleInputChange={handleInputChange}
          onPress={() => setActiveIndex(index)}
        />
      ))}
    </View>
  );
}
