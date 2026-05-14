import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";

const Dropdown = ({ label, value, options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mt-[3%]">
      <Text className="font-poppins-400regular text-base text-[#5C5F62] mb-[2%]">
        {label}
      </Text>

      <Pressable
        className="bg-white border border-[#CACACA] rounded-md px-[3%] py-[3%]"
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View className="flex-row justify-between items-center">
          <Text
            className={`font-poppins-400regular text-sm flex-1 ${value ? "text-black" : "text-[#898989]"}`}
          >
            {value || placeholder}
          </Text>
          <Text className="text-xs text-[#898989] ml-2">
            {isOpen ? "▲" : "▼"}
          </Text>
        </View>
      </Pressable>

      {isOpen && (
        <View className="bg-white border border-[#CACACA] rounded-md mt-1 max-h-[200px] shadow-md">
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {options.map((option, index) => (
              <Pressable
                key={option.value}
                className={`px-[3%] py-[3%] ${index !== options.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
                onPress={() => {
                  onSelect(option.value, option.label);
                  setIsOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text className="font-poppins-400regular text-sm text-black">
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Dropdown;
