// ============================================
// FilterModal.js - CLEAN & REUSING EXISTING COMPONENTS
// ============================================
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import DropdownMenu from "../profile/DropdownMenu";
import CanadianLocationDropdown from "./CanLocationDrop";
import PriceSlider from "../../tabs/home/PriceInput";
import ApplyFilterButton from "../../tabs/home/FilterButton";
import { useGetServiceCategoriesQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";
import { setJobField } from "../../../../redux/features/jobPost/jobPostSlice";

export default function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters = {},
}) {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetServiceCategoriesQuery();

  // Get price range from Redux (same as PriceSlider uses)
  const priceRange = useSelector((state) => state.jobPost.priceRange);

  const [localFilters, setLocalFilters] = useState({
    serviceType: "",
    location: null,
    latitude: undefined,
    longitude: undefined,
  });

  // Sync with parent filters when modal opens
  useEffect(() => {
    if (visible && currentFilters) {
      setLocalFilters({
        serviceType: currentFilters.serviceType || "",
        location: null,
        latitude: currentFilters.latitude,
        longitude: currentFilters.longitude,
      });

      // Sync price range to Redux if exists
      if (currentFilters.minPrice || currentFilters.maxPrice) {
        dispatch(
          setJobField({
            field: "priceRange",
            value: {
              from: currentFilters.minPrice || 0,
              to: currentFilters.maxPrice || 0,
              isPersonalized: false,
            },
          })
        );
      }
    }
  }, [visible, currentFilters, dispatch]);

  // Handle service type selection (DropdownMenu format)
  const handleServiceTypeSelect = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, serviceType: value }));
  };

  // Handle location selection
  const handleLocationSelect = (locationData) => {
    setLocalFilters((prev) => ({
      ...prev,
      location: locationData,
      latitude: locationData?.latitude,
      longitude: locationData?.longitude,
    }));
  };

  // Apply filters
  const handleApply = () => {
    const filtersToApply = {
      ...localFilters,
      minPrice: priceRange.from > 0 ? priceRange.from : undefined,
      maxPrice: priceRange.to > 0 ? priceRange.to : undefined,
    };

    // Filter out undefined/null values
    const cleanedFilters = Object.entries(filtersToApply).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    onApplyFilters?.(cleanedFilters);
    onClose();
  };

  // Clear all filters
  const handleClear = () => {
    setLocalFilters({
      serviceType: "",
      location: null,
      latitude: undefined,
      longitude: undefined,
    });

    // Reset Redux price range
    dispatch(
      setJobField({
        field: "priceRange",
        value: { from: 0, to: 0, isPersonalized: false },
      })
    );

    onClearFilters?.();
  };

  // Check if any filters are active
  const hasActiveFilters =
    localFilters.serviceType ||
    localFilters.location ||
    priceRange.from > 0 ||
    priceRange.to > 0;

  // Format service categories for dropdown
  const serviceOptions = data?.data?.categories || [];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
              className="w-[90%] max-h-[80%]"
            >
              <View className="bg-white rounded-lg border border-gray-200">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                  <Text className="text-lg font-poppins-600semibold text-gray-800">
                    Filter Jobs
                  </Text>
                  <View className="flex-row items-center gap-3">
                    {hasActiveFilters && (
                      <TouchableOpacity onPress={handleClear}>
                        <Text className="text-sm font-poppins-500medium text-[#175994]">
                          Clear All
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={onClose}>
                      <Ionicons name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Content */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: 20 }}
                  bounces={false}
                >
                  <View className="px-6 py-4">
                    {/* Service Type */}
                    <View className="mb-5">
                      <Text className="text-base font-poppins-600semibold text-gray-800 mb-3">
                        Service Type
                      </Text>
                      <DropdownMenu
                        isLoading={isLoading}
                        placeholder="Select service type"
                        options={serviceOptions}
                        selectedValue={localFilters.serviceType}
                        onSelect={handleServiceTypeSelect}
                        field="serviceType"
                        error={null}
                      />
                    </View>

                    {/* Location */}
                    <View className="mb-5">
                      <Text className="text-base font-poppins-600semibold text-gray-800 mb-3">
                        Location
                      </Text>
                      <CanadianLocationDropdown
                        onLocationSelect={handleLocationSelect}
                        selectedLocation={localFilters.location}
                      />
                    </View>

                    {/* Price Range - Reusing existing PriceSlider component */}
                    <View className="mb-5">
                      <PriceSlider />
                    </View>

                    {/* Apply Button */}
                    <ApplyFilterButton onPress={handleApply} />
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
