import { useState, useRef } from "react";
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

const LocationPicker = ({ onLocationSelect, error }) => {
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

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant location access.");
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
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
      Alert.alert("Error", "Failed to get location");
    } finally {
      setIsLoading(false);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
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

        // 🔥 Send data to parent signup form
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
    <View className="w-full my-[3%]">
      <Text className="font-poppins-400regular text-base text-[#000] mb-[2%]">
        Location
      </Text>
      <View className="flex-row items-center bg-[#F9F9F9] border border-[#DCDCDC] rounded-md px-[1%] py-[4%]">
        <TouchableOpacity
          onPress={() => setIsMapVisible(true)}
          disabled={isLoading}
          className="p-[3%] rounded-full"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="location-outline" size={20} color="#9E9E9E" />
          )}
        </TouchableOpacity>

        <TextInput
          className="flex-1 font-poppins-400regular text-sm bg-[#f9f9f9] text-black"
          placeholder="Tap the location icon to select"
          value={locationText}
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
        <View className="flex-1 bg-white">
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
