import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
// import { verticalScale, scale } from "../../components/adaptive/Adaptiveness";

const MapHeader = ({
  currentLocationName,
  handleBackPress,
  searchQuery,
  onSearchChange,
  isSearching,
  searchResults,
  onLocationSelect,
}) => {
  return (
    <View className="w-full bg-white border-b border-gray-100 px-[3%] py-2">
      <View className="flex-row items-center justify-between mb-2">
        <TouchableOpacity
          onPress={handleBackPress}
          style={{ height: verticalScale(40), width: scale(40) }}
          className="items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#C8C7CC" />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text
            className="text-lg font-poppins-500medium text-[#242E42]"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentLocationName}
          </Text>
        </View>

        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="close" size={24} color="#C8C7CC" />
        </TouchableOpacity>
      </View>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        isSearching={isSearching}
        searchResults={searchResults}
        onLocationSelect={onLocationSelect}
      />
    </View>
  );
};

const SearchBar = ({
  searchQuery,
  onSearchChange,
  isSearching,
  searchResults,
  onLocationSelect,
}) => {
  const handleClear = () => {
    onSearchChange("");
    Keyboard.dismiss();
  };

  return (
    <View className="bg-gray-100 rounded-lg relative">
      <View className="flex-row items-center px-3 py-2">
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          className="flex-1 ml-2 text-base font-poppins-400regular"
          placeholder="Search location..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          autoCorrect={false}
        />
        {isSearching && <ActivityIndicator size="small" color="#0066CC" />}
        {!isSearching && searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {(searchResults.length > 0 ||
        (!isSearching &&
          searchQuery.length >= 3 &&
          searchResults.length === 0)) && (
        <View className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-1 z-50 border border-gray-200">
          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 250 }}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  className={`px-4 py-3 ${index !== searchResults.length - 1 ? "border-b border-gray-100" : ""}`}
                  onPress={() => onLocationSelect(item)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-start">
                    <View className="mt-1">
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="#0066CC"
                      />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-base font-poppins-500medium text-gray-900">
                        {item.name}
                      </Text>
                      {item.subtitle && (
                        <Text className="text-sm font-poppins-400regular text-gray-500 mt-1">
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color="#C8C7CC"
                      style={{ marginTop: 2 }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          {!isSearching &&
            searchQuery.length >= 3 &&
            searchResults.length === 0 && (
              <View className="px-4 py-4">
                <View className="flex-row items-center">
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#999"
                  />
                  <Text className="ml-2 text-sm font-poppins-400regular text-gray-500">
                    No locations found for "{searchQuery}"
                  </Text>
                </View>
              </View>
            )}
        </View>
      )}
    </View>
  );
};

export default MapHeader;
