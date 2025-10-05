import { View, Text, TouchableOpacity, TextInput } from "react-native";
import XStyle from "../../../util/styles";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ onPress }) {
  return (
    <View className="mx-[6%]  pb-[1%] mt-[3%]">
      <View
        // style={[XStyle.lightShadow]}
        className="bg-white border border-gray-300  flex-row rounded-lg items-center px-[3%] py-[1%]"
      >
        <Ionicons name="search" size={24} color="#6B7280" />
        <TextInput
          placeholder="Search here..."
          placeholderTextColor="#898989"
          className="flex-1 ml-[2%] px-[2%] py-[3%]  font-poppins-400regular"
          color="#000"
          //   value={searchText}
          //   onChangeText={handleSearchChange}
          //   onFocus={handleSearchFocus}
          //   onBlur={handleSearchBlur}
        />
        <TouchableOpacity onPress={onPress}>
          <Ionicons name="options-outline" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
