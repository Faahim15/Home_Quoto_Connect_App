import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

export default function Notification({ title }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const animatedValue = new Animated.Value(isEnabled ? 1 : 0);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="w-full mt-[3%] bg-white rounded-xl border border-[#D4E0EB] ">
      {/* Main container */}
      <View className="w-[90%] bg-white mx-auto my-[2%] px-[4%] py-[3%]  ">
        {/* Content row */}
        <View className="flex-row items-center justify-between">
          {/* Text content */}
          <View className="flex-1 mr-[4%]">
            <Text className="font-poppins-500medium text-[#1F2937] text-base font-medium">
              {title}
            </Text>
          </View>

          {/* Toggle switch */}
          <Pressable
            onPress={toggleSwitch}
            className={` rounded-full relative ${
              isEnabled ? "bg-[#cae4fd]" : "bg-[#E4E4E4]"
            }`}
            activeOpacity={0.7}
            style={{ width: scale(48), height: verticalScale(24) }}
          >
            {/* Toggle circle */}
            <Animated.View
              className={`absolute top-[8%]   rounded-full shadow-sm ${
                isEnabled ? "bg-[#319FCA]" : "bg-[#fff]"
              } `}
              style={{
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 30], // Adjust based on your design needs
                    }),
                  },
                ],
                width: scale(20),
                height: verticalScale(20),
              }}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
