import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

const LocationPicker = ({ onLocationSelect, error, value, mode }) => {
  const [locationText, setLocationText] = useState("");
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 23.8103,
    longitude: 90.4125,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null);

  // Request permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable location access in your settings to use this feature."
        );
      }
    })();
  }, []);

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
    } catch (error) {
      console.log("Location error:", error);
      Alert.alert("Error", "Failed to get your location.");
    } finally {
      setIsLoading(false);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Reverse geocode skipped: permission not granted");
        return;
      }

      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        // console.log('show address',address);
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

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoordinate({ latitude, longitude });
    await reverseGeocode(latitude, longitude);
  };

  const confirmLocation = () => {
    if (!selectedCoordinate) {
      Alert.alert("No Location", "Please select a location.");
      return;
    }
    setIsMapVisible(false);
  };

  return (
    <View className="w-full my-[2%]">
      <Text
        className={`font-poppins-400regular   text-base  mb-[2%] ${mode === "edit" ? "text-[#5C5F62]" : "text-black"} `}
      >
        Location
      </Text>
      <View
        className={`flex-row justify-center items-center  ${mode === "edit" ? "bg-white px-[1%] py-[2%] rounded-lg" : "bg-[#f9f9f9] px-[1%] py-[4%] rounded-md"} border border-[#DCDCDC] `}
      >
        <TouchableOpacity
          onPress={() => setIsMapVisible(true)}
          disabled={isLoading}
          className={` ${mode === "edit" ? "pb-[1%]" : "p-[3%]"} rounded-full`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="location-outline" size={20} color="#9E9E9E" />
          )}
        </TouchableOpacity>

        <TextInput
          className={`flex-1 font-poppins-400regular text-sm  ${mode === "edit" ? "bg-white" : "bg-[#f9f9f9]"} text-black`}
          placeholder="Tap the location icon to select"
          placeholderTextColor="#6B7280"
          value={value}
          editable={false}
          multiline
        />
      </View>
      {error && (
        <Text className="text-red-700 font-poppins text-center mt-1">
          {error}
        </Text>
      )}

      <Modal visible={isMapVisible} animationType="slide">
        <View className="flex-1 mt-[10%] bg-white">
          <View className="bg-white p-[5%] border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={() => setIsMapVisible(false)}>
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Select Location</Text>
              <TouchableOpacity
                onPress={confirmLocation}
                className="bg-blue-500 px-[4%] py-[2%] rounded-lg"
              >
                <Text className="text-white font-medium">Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          <MapView
            ref={mapRef}
            style={{ width, height: height * 0.8 }}
            region={mapRegion}
            onPress={handleMapPress}
            showsUserLocation
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

          <TouchableOpacity
            onPress={getCurrentLocation}
            className="absolute bottom-[5%] right-[5%] bg-white p-[3%] rounded-full shadow-lg"
          >
            <Ionicons name="locate" size={24} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default LocationPicker;
