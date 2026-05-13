import { View } from "react-native";
import SingleButton from "./SingleButton";
import { useState, useEffect } from "react";

export default function ButtonGroup({ handleInputChange, selectedOption }) {
  const titles = ["urgent", "asap", "next_week"];
  const [activeIndex, setActiveIndex] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  //  Initialize active index from selectedOption prop
  useEffect(() => {
    if (selectedOption && !isInitialized) {
      const index = titles.indexOf(selectedOption);
      if (index !== -1) {
        setActiveIndex(index);
      }
      setIsInitialized(true);
    }
  }, [selectedOption, isInitialized]);

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
