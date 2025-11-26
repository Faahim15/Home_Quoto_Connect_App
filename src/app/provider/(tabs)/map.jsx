import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  Platform,
  TextInput,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import ServiceQuoteModal from "../../components/provider/map/QuoteModal";
import nearbyUsers from "../../components/data/provider/MapData";
import { scale, verticalScale } from "../../components/adaptive/Adaptiveness";
import { router } from "expo-router";
import { useGetAllJobsQuery } from "../../redux/slices/jobSlice";

const MapScreen = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useState(
    "San Diego, California, US"
  );

  const searchTimeoutRef = useRef(null);

  // Fetch jobs based on user location with 10km radius
  const {
    data: nearbyJobsData,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
  } = useGetAllJobsQuery(
    {
      latitude: userLocation?.latitude,
      longitude: userLocation?.longitude,
      radius: 10000, // 10km radius
      page: 1,
      limit: 50,
    },
    {
      skip: !userLocation, // Skip query until we have user location
    }
  );

  // Extract jobs array from API response
  const nearbyJobs = nearbyJobsData?.data?.jobs || [];

  // Initial region for San Diego
  const initialRegion = {
    latitude: 32.7157,
    longitude: -117.1611,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to show your position on the map."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(newLocation);

      // Get location name from coordinates
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        });

        if (reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          // Build location name from available data
          const locationParts = [];

          if (place.city) locationParts.push(place.city);
          if (place.region) locationParts.push(place.region);
          if (place.country) locationParts.push(place.country);

          const locationName = locationParts.join(", ") || "Current Location";
          setCurrentLocationName(locationName);
        }
      } catch (error) {
        console.error("Error getting location name:", error);
        setCurrentLocationName("Current Location");
      }

      // Animate to user location if map is ready
      if (mapRef) {
        mapRef.animateToRegion(
          {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  // Refetch jobs when user location changes
  useEffect(() => {
    if (userLocation) {
      refetchJobs();
    }
  }, [userLocation]);

  const searchLocation = async (query) => {
    if (!query || query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);

      // Use Location.geocodeAsync which returns location data
      const results = await Location.geocodeAsync(query);

      if (results.length > 0) {
        // For each coordinate, get the reverse geocode to get the place name
        const formattedResults = await Promise.all(
          results.map(async (result, index) => {
            try {
              // Reverse geocode to get place details
              const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: result.latitude,
                longitude: result.longitude,
              });

              let displayName = query;
              let subtitle = "";

              if (reverseGeocode.length > 0) {
                const place = reverseGeocode[0];

                // Build a readable place name
                const nameParts = [];

                if (place.name) nameParts.push(place.name);
                if (place.city) nameParts.push(place.city);
                if (place.region) nameParts.push(place.region);
                if (place.country) nameParts.push(place.country);

                displayName = nameParts.slice(0, 2).join(", ") || query;
                subtitle = nameParts.slice(2).join(", ");

                // If no proper name found, use subregion or district
                if (!displayName || displayName === query) {
                  const fallbackParts = [];
                  if (place.subregion) fallbackParts.push(place.subregion);
                  if (place.district) fallbackParts.push(place.district);
                  if (place.region) fallbackParts.push(place.region);
                  if (place.country) fallbackParts.push(place.country);

                  displayName = fallbackParts[0] || query;
                  subtitle = fallbackParts.slice(1).join(", ");
                }
              }

              return {
                id: `${index}-${result.latitude}-${result.longitude}`,
                latitude: result.latitude,
                longitude: result.longitude,
                name: displayName,
                subtitle: subtitle,
                fullAddress:
                  reverseGeocode.length > 0 ? reverseGeocode[0] : null,
              };
            } catch (error) {
              console.error("Error in reverse geocoding:", error);
              return {
                id: `${index}-${result.latitude}-${result.longitude}`,
                latitude: result.latitude,
                longitude: result.longitude,
                name: query,
                subtitle: `${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`,
                fullAddress: null,
              };
            }
          })
        );

        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.length >= 3) {
      // Debounce search by 500ms
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(text);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (location) => {
    if (mapRef) {
      mapRef.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }

    // Update the location name in header
    if (location.name) {
      const displayName = location.subtitle
        ? `${location.name}, ${location.subtitle}`
        : location.name;
      setCurrentLocationName(displayName);
    }

    // Update user location state
    setUserLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });

    setSearchQuery("");
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const handleGoOnline = () => {
    setIsOnline(true);
    Alert.alert("Status Updated", "You are now online and visible to others!");
  };

  const handleMarkerPress = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleGoOffline = () => {
    setIsOnline(false);
  };

  const handleBackPress = () => {
    router.back();
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  // Custom marker for jobs from API
  const JobMarker = ({ job }) => {
    // Get coordinates from job location (GeoJSON format: [longitude, latitude])
    const longitude = job.location?.coordinates?.[0];
    const latitude = job.location?.coordinates?.[1];

    // Skip if coordinates are missing
    if (!longitude || !latitude) return null;

    return (
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        key={job._id}
        onPress={() => handleMarkerPress(job)}
      >
        <View className="w-12 h-12 rounded-full bg-cyan-500 border-3 border-white shadow-lg items-center justify-center">
          <Ionicons name="briefcase" size={20} color="white" />
        </View>
      </Marker>
    );
  };

  const CustomMarker = ({ user }) => (
    <Marker
      coordinate={user.coordinate}
      key={user.id}
      onPress={() => handleMarkerPress(user)}
    >
      <View className="w-12 h-12 rounded-full bg-blue-500 border-3 border-white shadow-lg items-center justify-center">
        <Text className="text-lg">{user.avatar}</Text>
      </View>
    </Marker>
  );

  const UserLocationMarker = () =>
    userLocation && (
      <Marker coordinate={userLocation}>
        <View className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg" />
      </Marker>
    );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
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

        {/* Search Bar */}
        <View className="bg-gray-100 rounded-lg relative">
          <View className="flex-row items-center px-3 py-2">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base font-poppins-400regular"
              placeholder="Search location..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearchChange}
              returnKeyType="search"
              autoCorrect={false}
            />
            {isSearching && <ActivityIndicator size="small" color="#0066CC" />}
            {!isSearching && searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  Keyboard.dismiss();
                }}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Results Dropdown */}
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
                      className={`px-4 py-3 ${
                        index !== searchResults.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                      onPress={() => handleLocationSelect(item)}
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
      </View>

      {/* Map Container */}
      <View className="flex-1 relative">
        <MapView
          ref={(ref) => setMapRef(ref)}
          style={{ width: "100%", height: "100%" }}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={false}
          showsMyLocationButton={false}
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
          mapType="standard"
          customMapStyle={[
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ]}
        >
          {/* Render jobs from API */}
          {nearbyJobs.map((job) => (
            <JobMarker key={job._id} job={job} />
          ))}

          {/* Render nearby users (keeping for backward compatibility) */}
          {nearbyUsers.map((user) => (
            <CustomMarker key={user.id} user={user} />
          ))}

          {/* User's current location */}
          <UserLocationMarker />
        </MapView>

        {/* Location button */}
        <TouchableOpacity
          onPress={getCurrentLocation}
          className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center"
        >
          <Ionicons name="locate" size={20} color="#0066CC" />
        </TouchableOpacity>
      </View>

      {/* Bottom Status Panel */}
      <View className="w-full bg-white border-t border-gray-100">
        {/* Status Text */}
        <View className="items-center py-4">
          <Text className="text-base font-poppins-500medium text-gray-900">
            {isOnline ? "You're online" : "You're offline"}
          </Text>
          {userLocation && (
            <Text className="text-sm font-poppins-400regular text-gray-500 mt-1">
              {isLoadingJobs
                ? "Loading nearby jobs..."
                : `${nearbyJobs.length} jobs nearby`}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center justify-between px-[3%] pb-[3%]">
          <View className="w-[10%]"></View>
          {/* Main Action Button */}
          <TouchableOpacity
            style={{ height: verticalScale(44) }}
            onPress={isOnline ? handleGoOffline : handleGoOnline}
            className={`flex-1 mx-[3%]  rounded-full items-center justify-center ${
              isOnline ? "bg-red-500" : "bg-cyan-500"
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-white font-poppins-500medium text-base">
              {isOnline ? "Go Offline" : "Go Online"}
            </Text>
          </TouchableOpacity>

          {/* Settings/Options Button */}
          <TouchableOpacity
            style={{ width: scale(40), height: verticalScale(40) }}
            className="rounded-full border border-[#666] items-center justify-center"
          >
            <Ionicons name="options-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Quote Modal */}
      <ServiceQuoteModal
        visible={modalVisible}
        selectedUser={selectedUser}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
};

export default MapScreen;
