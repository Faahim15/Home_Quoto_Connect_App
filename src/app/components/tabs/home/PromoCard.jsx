import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import XStyle from "../../../util/styles";
import { useState } from "react";
import UserFilterModal from "./modal/FilterModal";
export default function PromoCard() {
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  function modalCloseHanlder() {
    setShowModal(false);
  }
  const recentSearches = [
    { id: "1", term: "Plumber", results: 232 },
    { id: "2", term: "Cloth washer", results: 112 },
    { id: "3", term: "Electrical Repairs", results: 12 },
    { id: "4", term: "House Cleaning", results: 76 },
    { id: "5", term: "Appliance Maintenance", results: 87 },
    { id: "6", term: "Cloth washer", results: 112 },
    { id: "7", term: "Cloth washer", results: 112 },
    { id: "8", term: "Cloth washer", results: 112 },
    { id: "9", term: "Cloth washer", results: 112 },
    { id: "10", term: "Cloth washer", results: 112 },
  ];
  // Handle text input change
  const handleSearchChange = (text) => {
    setSearchText(text);

    // Show recent searches when user starts typing
    if (text.length > 0) {
      setShowRecentSearches(true);
    } else {
      setShowRecentSearches(false);
    }
  };
  // Handle when user selects a recent search
  const handleRecentSearchSelect = (searchTerm) => {
    setSearchText(searchTerm);
    setShowRecentSearches(false);
    // Here you can trigger your search function
    performSearch(searchTerm);
  };
  // Handle search focus
  const handleSearchFocus = () => {
    if (searchText.length > 0) {
      setShowRecentSearches(true);
    }
  };
  // Handle search blur (when user clicks outside)
  const handleSearchBlur = () => {
    // Small delay to allow recent search selection
    setTimeout(() => {
      setShowRecentSearches(false);
    }, 200);
  };
  // Clear recent searches
  const clearRecentSearches = () => {
    // Here you can clear from your storage/state
    console.log("Clear recent searches");
  };
  // Your search function
  const performSearch = (term) => {
    console.log("Searching for:", term);
    // Implement your search logic here
  };
  // Filter recent searches based on current input
  const filteredRecentSearches = recentSearches.filter((item) =>
    item.term.toLowerCase().includes(searchText.toLowerCase()),
  );
  const renderRecentSearchItem = ({ item }) => (
    <Pressable
      style={styles.recentSearchItem}
      className="font-poppins-400regular  "
      onPress={() => handleRecentSearchSelect(item.term)}
    >
      <Text className="font-poppins-500medium text-sm text-[#6B7280]">
        {item.term}
      </Text>
      <Text
        className="font-poppins-400regular text-xs text-[#6B7280] "
        style={styles.recentSearchResults}
      >
        {item.results} results{" "}
      </Text>
    </Pressable>
  );
  return (
    <View className="mx-[6.4%]  w-[87%]  mt-[3%] ">
      {/* Main Promo Card with Gradient Background */}
      <LinearGradient
        colors={["#319FCA", "#18649F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-md overflow-hidden relative"
      >
        <View className="flex-row overflow-visible ">
          {/* Left Content */}
          <View className="flex-1 px-[6%] overflow-visible py-6 justify-center">
            <Text className="text-white font-poppins-bold text-2xl  mb-[0.5%]">
              Save Big Today!
            </Text>
            <Text className="text-white text-sm  font-poppins-500medium">
              Get Premium Home{"\n"}Services at Best Prices
            </Text>
          </View>

          {/* Right Image */}
          <View
            style={{
              width: scale(120),
              height: verticalScale(120),
              position: "absolute",
              right: scale(20),
              top: verticalScale(-10),
            }}
          >
            <Image
              source={require("../../../../../assets/images/home/cover.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Search Bar */}
        {/* <View className=" ">
          <View
            style={[XStyle.lightShadow]}
            className="bg-white  flex-row rounded-md mt-[1%] items-center px-[3%] py-[3%]"
          >
            <Ionicons name="search" size={24} color="#6B7280" />
            <TextInput
              placeholder="Search here..."
              placeholderTextColor="#898989"
              className="flex-1 ml-[2%] px-[2%] py-[3%]   font-poppins-400regular"
              color="#000"
              value={searchText}
              onChangeText={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Ionicons name="options-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <View>
              <UserFilterModal
                visible={showModal}
                onClose={modalCloseHanlder}
              />
            </View>
          </View>
        </View> */}
      </LinearGradient>
      {/* Recent Searches Dropdown */}
      {showRecentSearches && (
        <View
          style={{
            borderTopLeftRadius: scale(6),
            borderTopRightRadius: scale(6),
            borderBottomRightRadius: scale(6),
            borderBottomLeftRadius: scale(6),
          }}
          className=" bg-[#FFFFFF] mt-[2%] border border-[#DCDCDC] "
        >
          <View style={styles.recentSearchesHeader}>
            <Text className="font-poppins-semiBold text-base text-[#6B7280]">
              Recent Searches
            </Text>
            <Pressable onPress={clearRecentSearches}>
              <Text className="font-poppins-400regular text-base text-[#175994]">
                Clear
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={filteredRecentSearches}
            renderItem={renderRecentSearchItem}
            keyExtractor={(item) => item.id}
            style={styles.recentSearchesList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  recentSearchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    // borderBottomWidth: scale(1),
    // borderBottomColor: "#eee",
  },

  recentSearchesList: {
    maxHeight: verticalScale(280),
  },
  recentSearchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    // borderBottomWidth: 1,
    // borderBottomColor: "#f0f0f0",
  },
  recentSearchTerm: {
    fontSize: 16,
    color: "#6B7280",
  },
  recentSearchResults: {
    fontSize: 14,
    color: "#666",
  },
});
