import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Text,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const LocationPicker = ({ onLocationSelect, error, value, mode }) => {
  const [locationText, setLocationText] = useState(value || "");
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 23.8103,
    longitude: 90.4125,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null);
  const searchTimeout = useRef(null);

  // On mount: permission নাও এবং silently current location দিয়ে mapRegion set করো
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable location access in your settings to use this feature."
        );
        return;
      }

      try {
        const isEnabled = await Location.hasServicesEnabledAsync();
        if (!isEnabled) return;

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = location.coords;
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } catch (e) {
        // silently fail — default region থাকবে
      }
    })();
  }, []);

  useEffect(() => {
    if (value !== undefined) setLocationText(value);
  }, [value]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant location access.");
      return false;
    }
    return true;
  };

  const ensureLocationEnabled = async () => {
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      Alert.alert(
        "Location Services Disabled",
        "Please enable GPS/location services to continue."
      );
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;
      const isEnabled = await ensureLocationEnabled();
      if (!isEnabled) return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const { latitude, longitude } = location.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setMapRegion(newRegion);
      setSelectedCoordinate({ latitude, longitude });
      await reverseGeocode(latitude, longitude);
      if (mapRef.current) mapRef.current.animateToRegion(newRegion, 800);
    } catch (error) {
      Alert.alert("Error", "Failed to get your location.");
    } finally {
      setIsLoading(false);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") return;

      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        const formattedAddress = [
          address.name,
          address.street,
          address.district,
          address.city,
          address.region,
          address.country,
        ]
          .filter(Boolean)
          .join(", ");

        setLocationText(formattedAddress);
        setSearchQuery(formattedAddress);

        onLocationSelect({
          type: "Point",
          coordinates: [longitude, latitude],
          address: formattedAddress,
          city: address.city || "",
          state: address.region || "",
          country: address.country || "",
          zipCode: address.postalCode || "",
        });
      }
    } catch (error) {
      console.log("Reverse geocode error:", error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5`,
          { headers: { "User-Agent": "LocationPickerApp/1.0" } }
        );
        const data = await res.json();
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const handleSearchResultSelect = async (item) => {
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setMapRegion(newRegion);
    setSelectedCoordinate({ latitude, longitude });
    setSearchQuery(item.display_name);
    setSearchResults([]);
    if (mapRef.current) mapRef.current.animateToRegion(newRegion, 800);
    await reverseGeocode(latitude, longitude);
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedCoordinate({ latitude, longitude });
    await reverseGeocode(latitude, longitude);
  };

  const confirmLocation = () => {
    if (!selectedCoordinate) {
      Alert.alert("No Location", "Please select a location on the map.");
      return;
    }
    setIsMapVisible(false);
    setSearchResults([]);
  };

  const isEditMode = mode === "edit";

  return (
    <View className="w-full my-2">
      {/* Label */}
      <Text
        className={`font-poppins-400regular text-sm mb-1.5 ${
          isEditMode ? "text-[#5C5F62]" : "text-black"
        }`}
      >
        Location
      </Text>

      {/* Trigger Row */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsMapVisible(true)}
        className={`flex-row items-center border border-[#DCDCDC] rounded-xl px-3 ${
          isEditMode ? "bg-white py-2.5" : "bg-[#F9FAFB] py-3"
        }`}
      >
        {/* Icon Badge */}
        <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center mr-2.5">
          {isLoading ? (
            <ActivityIndicator size="small" color="#0054A5" />
          ) : (
            <Ionicons name="location-sharp" size={18} color="#0054A5" />
          )}
        </View>

        {/* Address Text */}
        <Text
          numberOfLines={1}
          className={`flex-1 font-poppins-400regular text-sm ${
            locationText ? "text-[#111827]" : "text-[#9CA3AF]"
          }`}
        >
          {locationText || "Tap to select location"}
        </Text>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Error */}
      {error && (
        <Text className="text-red-700 font-poppins-400regular text-xs text-center mt-1">
          {error}
        </Text>
      )}

      {/* Map Modal */}
      <Modal visible={isMapVisible} animationType="slide" statusBarTranslucent>
        <View className="flex-1 bg-white">
          {/* Header */}
          <View
            className={`flex-row items-center justify-between px-4 pb-3 bg-white border-b border-gray-100 ${
              Platform.OS === "ios" ? "pt-14" : "pt-11"
            }`}
          >
            <TouchableOpacity
              onPress={() => {
                setIsMapVisible(false);
                setSearchResults([]);
              }}
              className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={22} color="#111" />
            </TouchableOpacity>

            <Text className="text-base font-poppins-semiBold text-[#111827]">
              Pick a Location
            </Text>

            <TouchableOpacity
              onPress={confirmLocation}
              className="bg-[#0054A5] px-5 py-2 rounded-full"
            >
              <Text className="text-white font-poppins-semiBold text-sm">
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="px-4 py-3 bg-white z-10">
            <View className="flex-row items-center bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5">
              <Ionicons name="search-outline" size={18} color="#6B7280" />
              <TextInput
                className="flex-1 font-poppins-400regular text-sm text-[#111827] mx-2"
                placeholder="Search for a place…"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={handleSearch}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Dropdown */}
            {(searchResults.length > 0 || isSearching) && (
              <View className="mt-1 bg-white rounded-xl border border-gray-200 max-h-52 overflow-hidden shadow-md">
                {isSearching ? (
                  <View className="flex-row items-center p-3.5">
                    <ActivityIndicator size="small" color="#0054A5" />
                    <Text className="font-poppins-400regular text-sm text-gray-500 ml-2">
                      Searching…
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.place_id?.toString()}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item, index }) => (
                      <>
                        <TouchableOpacity
                          className="flex-row items-start px-3.5 py-2.5"
                          onPress={() => handleSearchResultSelect(item)}
                        >
                          <Ionicons
                            name="location-outline"
                            size={16}
                            color="#0054A5"
                            style={{ marginRight: 10, marginTop: 2 }}
                          />
                          <Text
                            className="flex-1 font-poppins-400regular text-xs text-gray-700 leading-5"
                            numberOfLines={2}
                          >
                            {item.display_name}
                          </Text>
                        </TouchableOpacity>
                        {index < searchResults.length - 1 && (
                          <View className="h-px bg-gray-100 mx-3.5" />
                        )}
                      </>
                    )}
                  />
                )}
              </View>
            )}
          </View>

          {/* Map */}
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            region={mapRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {selectedCoordinate && (
              <Marker
                coordinate={selectedCoordinate}
                draggable
                onDragEnd={async (e) => {
                  const { latitude, longitude } = e.nativeEvent.coordinate;
                  setSelectedCoordinate({ latitude, longitude });
                  await reverseGeocode(latitude, longitude);
                }}
              />
            )}
          </MapView>

          {/* Selected Address Pill */}
          {locationText ? (
            <View className="absolute bottom-24 left-4 right-16 bg-white border border-green-100 rounded-xl flex-row items-start px-3.5 py-2.5 shadow-md">
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#16A34A"
                style={{ marginRight: 6, marginTop: 1 }}
              />
              <Text
                className="flex-1 font-poppins-400regular text-xs text-[#111827] leading-[17px]"
                numberOfLines={2}
              >
                {locationText}
              </Text>
            </View>
          ) : null}

          {/* My Location FAB */}
          <TouchableOpacity
            onPress={getCurrentLocation}
            activeOpacity={0.85}
            className="absolute bottom-24 right-4 w-12 h-12 rounded-2xl bg-white items-center justify-center shadow-md"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#0054A5" />
            ) : (
              <Ionicons name="locate" size={22} color="#0054A5" />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default LocationPicker;