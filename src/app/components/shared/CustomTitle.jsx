import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTitle({ title, withSafeTop = false }) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <View 
      style={{
        // যদি withSafeTop true হয় তবে ইনসেট প্যাডিং যোগ হবে
        paddingTop: withSafeTop ? insets.top : 0,
        backgroundColor: "#F9F9F9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 2, 
      }}
    >
      <View className="flex-row items-center px-[5%] py-[3%] w-full border-b border-gray-200">
        {/* Back Button */}
        <Pressable 
          onPress={handleBack}
          className="active:opacity-50 p-1 -ml-1"
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </Pressable>

        {/* Title */}
        <View className="flex-1 ml-2">
          <Text 
            numberOfLines={1} 
            className="font-poppins-semiBold text-[18px] text-[#111827] tracking-tight"
          >
            {title}
          </Text>
        </View>
        
        {/* Balance spacer */}
        <View className="w-8" />
      </View>
    </View>
  );
}