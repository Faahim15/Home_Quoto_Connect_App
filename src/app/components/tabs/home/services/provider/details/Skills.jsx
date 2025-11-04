import { View, Text, TouchableOpacity } from "react-native";

export default function Skills({ title = "Skills", specializations }) {
  // console.log(specializations);
  return (
    <View className="mx-[6%] mt-[3%] ">
      <Text className="font-poppins-semiBold text-base text-[#565656]">
        {title}
      </Text>

      <View className="flex-row flex-wrap gap-[2%] mt-[2%] ">
        {/* {data.map((skill, idx) => (
          <TouchableOpacity
            key={idx}
            className="bg-white font-poppins-500medium  border-[#D4E0EB] px-[3%] py-[3%] rounded-lg border"
          >
            <Text className=" font-poppins-500medium text-xs text-[#565656]  ">
              {skill}
            </Text>
          </TouchableOpacity>
        ))} */}
        <Text className="bg-white font-poppins-500medium  border-[#D4E0EB] px-[3%] py-[3%] rounded-lg border">
          {specializations[0]?.title}{" "}
          {specializations?.length > 1 ? `+${specializations.length - 1}` : ""}
        </Text>
      </View>
    </View>
  );
}
