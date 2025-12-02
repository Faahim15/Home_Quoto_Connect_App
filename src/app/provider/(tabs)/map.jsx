import { useState, useEffect, useRef } from "react";
import { SafeAreaView, StatusBar, Alert, Keyboard } from "react-native";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useGetAllJobsQuery } from "../../../redux/features/apiSlices/user/createJobSlices";
import MapHeader from "../../components/provider/map/MapHeader";
import MapContainer from "../../components/provider/map/MapContainer";
import BottomStatusPanel from "../../components/provider/map/BottomStatusPanel";
import ServiceQuoteModal from "../../components/shared/modal/ServiceQuoteModal";

const MapScreen = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useState(
    "San Diego, California, US"
  );

  const searchTimeoutRef = useRef(null);

  const {
    data: nearbyJobsData,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
  } = useGetAllJobsQuery(
    {
      latitude: userLocation?.latitude,
      longitude: userLocation?.longitude,
      radius: 10000,
      page: 1,
      limit: 50,
    },
    {
      skip: !userLocation,
    }
  );

  const nearbyJobs =
    nearbyJobsData?.data?.jobs?.filter((job) => job.status === "pending") || [];

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
      // Cleanup: dismiss any open alerts when component unmounts
      if (Alert.dismissAll) {
        Alert.dismissAll();
      }

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      refetchJobs();
    }
  }, [userLocation]);

  const getCurrentLocation = async () => {
    try {
      // Step 1: Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings to use this feature.",
          [{ text: "OK" }]
        );
        return;
      }

      // Step 2: Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show your position on the map.",
          [{ text: "OK" }]
        );
        return;
      }

      // Step 3: Try multiple methods to get location
      let location = null;

      // Method 1: Try last known position first
      try {
        const lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown) {
          location = lastKnown;
          console.log("Using last known position");
        }
      } catch (error) {
        console.log("Last known position not available:", error.message);
      }

      // Method 2: If no last known, try current position with low accuracy
      if (!location) {
        try {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Lowest,
            maximumAge: 10000,
          });
          console.log("Got current position with low accuracy");
        } catch (error) {
          console.log("Low accuracy failed:", error.message);
        }
      }

      // Method 3: Try with timeout
      if (!location) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 15000)
          );

          const locationPromise = Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });

          location = await Promise.race([locationPromise, timeoutPromise]);
          console.log("Got position with timeout handler");
        } catch (error) {
          console.log("Timeout method failed:", error.message);
        }
      }

      // If all methods fail, use default location
      if (!location) {
        console.log("All location methods failed, using default location");
        const newLocation = {
          latitude: initialRegion.latitude,
          longitude: initialRegion.longitude,
        };
        setUserLocation(newLocation);
        setCurrentLocationName("San Diego, California, US");

        if (mapRef) {
          mapRef.animateToRegion(initialRegion, 1000);
        }
        return;
      }

      // Step 4: Set the location
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(newLocation);

      // Step 5: Get location name
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        });

        if (reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
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

      // Step 6: Animate map to user location
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

      // Fallback to default location without showing error
      const newLocation = {
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
      };
      setUserLocation(newLocation);
      setCurrentLocationName("San Diego, California, US");

      if (mapRef) {
        mapRef.animateToRegion(initialRegion, 1000);
      }
    }
  };
  const searchLocation = async (query) => {
    if (!query || query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);

      const results = await Location.geocodeAsync(query);

      if (results.length > 0) {
        const formattedResults = await Promise.all(
          results.map(async (result, index) => {
            try {
              const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: result.latitude,
                longitude: result.longitude,
              });

              let displayName = query;
              let subtitle = "";

              if (reverseGeocode.length > 0) {
                const place = reverseGeocode[0];

                const nameParts = [];

                if (place.name) nameParts.push(place.name);
                if (place.city) nameParts.push(place.city);
                if (place.region) nameParts.push(place.region);
                if (place.country) nameParts.push(place.country);

                displayName = nameParts.slice(0, 2).join(", ") || query;
                subtitle = nameParts.slice(2).join(", ");

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

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.length >= 3) {
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

    if (location.name) {
      const displayName = location.subtitle
        ? `${location.name}, ${location.subtitle}`
        : location.name;
      setCurrentLocationName(displayName);
    }

    setUserLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });

    setSearchQuery("");
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleMarkerPress = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    const status = !isOnline ? "online" : "offline";
    Alert.alert(
      "Status Updated",
      `You are now ${status} and ${!isOnline ? "visible" : "not visible"} to others!`
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <MapHeader
        currentLocationName={currentLocationName}
        handleBackPress={handleBackPress}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isSearching={isSearching}
        searchResults={searchResults}
        onLocationSelect={handleLocationSelect}
      />

      <MapContainer
        mapRef={setMapRef}
        initialRegion={initialRegion}
        nearbyJobs={nearbyJobs}
        userLocation={userLocation}
        onMarkerPress={handleMarkerPress}
        onGetLocation={getCurrentLocation}
      />

      <BottomStatusPanel
        isOnline={isOnline}
        isLoadingJobs={isLoadingJobs}
        nearbyJobsCount={nearbyJobs.length}
        userLocation={userLocation}
        onToggleOnline={handleToggleOnline}
      />

      <ServiceQuoteModal
        visible={modalVisible}
        selectedJob={selectedJob}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
};

export default MapScreen;
