import { View, Text } from "react-native";
import ArrowBack from "./ArrowBack";

export default function CustomHeader({ title, nestedTitle, subtitle,arrowBack=true }) {
  return (
    <View> 
      {
        arrowBack && (      <ArrowBack />)
      }

      <View className="mt-[1.5%]  justify-center items-center ">
        <Text className="font-poppins-500medium text-2xl  text-[#292929] ">
          {title} <Text className="text-[#319FCA]">{nestedTitle}</Text>
        </Text>
        <Text
          style={{ letterSpacing: 0.2 }}
          className=" mt-[2%] font-poppins-400regular text-xs text-center "
        >
          {subtitle && subtitle}
        </Text>
      </View>
    </View>
  );
}
