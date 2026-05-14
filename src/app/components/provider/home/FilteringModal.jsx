// ============================================
// FilterModal.js - UPDATED FOR OBJECT SERVICE TYPE
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
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import PriceSlider from "../../tabs/home/PriceInput";
import ApplyFilterButton from "../../tabs/home/FilterButton";
import { useGetServiceCategoriesQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";
import { setJobField } from "../../../../redux/features/jobPost/jobPostSlice";

import FilterDropdown from "../profile/FilterDropdown";

export default function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters = {},
}) {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetServiceCategoriesQuery();

  const priceRange = useSelector((state) => state.jobPost.priceRange);

  const [localFilters, setLocalFilters] = useState({
    serviceType: null, // <-- full object
    // location: null,
    // latitude: undefined,
    // longitude: undefined,
  });

  // Sync with parent filters
  useEffect(() => {
    if (visible && currentFilters) {
      setLocalFilters({
        serviceType: currentFilters.serviceType || null,
        // location: null,
        // latitude: currentFilters.latitude,
        // longitude: currentFilters.longitude,
      });

      if (currentFilters.minPrice || currentFilters.maxPrice) {
        dispatch(
          setJobField({
            field: "priceRange",
            value: {
              from: currentFilters.minPrice || 0,
              to: currentFilters.maxPrice || 0,
              isPersonalized: false,
            },
          }),
        );
      }
    }
  }, [visible, currentFilters, dispatch]);

  // Handle service type as OBJECT
  const handleServiceTypeSelect = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      serviceType: value, // full object
    }));
  };

  const handleLocationSelect = (locationData) => {
    setLocalFilters((prev) => ({
      ...prev,
      location: locationData,
      latitude: locationData?.latitude,
      longitude: locationData?.longitude,
    }));
  };

  // Final apply filters
  const handleApply = () => {
    const filtersToApply = {
      ...localFilters,
      serviceType: localFilters.serviceType?._id, // send only ID to backend
      minPrice: priceRange.from > 0 ? priceRange.from : undefined,
      maxPrice: priceRange.to > 0 ? priceRange.to : undefined,
    };

    // Clean empty values
    const cleanedFilters = Object.entries(filtersToApply).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    onApplyFilters?.(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({
      serviceType: null,
      location: null,
      latitude: undefined,
      longitude: undefined,
    });

    dispatch(
      setJobField({
        field: "priceRange",
        value: { from: 0, to: 0, isPersonalized: false },
      }),
    );

    onClearFilters?.();
  };

  const hasActiveFilters =
    localFilters.serviceType ||
    localFilters.location ||
    priceRange.from > 0 ||
    priceRange.to > 0;

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
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
              className="w-[90%] max-h-[80%]"
            >
              <View className="bg-white rounded-lg border border-gray-200">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                  <Text className="text-lg font-poppins-bold text-gray-800">
                    Filter Jobs
                  </Text>

                  <View className="flex-row items-center gap-3">
                    {hasActiveFilters && (
                      <Pressable onPress={handleClear}>
                        <Text className="text-sm font-poppins-500medium text-[#175994]">
                          Clear All
                        </Text>
                      </Pressable>
                    )}

                    <Pressable onPress={onClose}>
                      <Ionicons name="close" size={24} color="#6B7280" />
                    </Pressable>
                  </View>
                </View>

                {/* Body */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: 20 }}
                  bounces={false}
                >
                  <View className="px-6 py-4">
                    {/* Service Type Dropdown */}
                    <View className="mb-5">
                      <FilterDropdown
                        isLoading={isLoading}
                        placeholder="Select service type"
                        options={serviceOptions}
                        selectedValue={localFilters.serviceType}
                        onSelect={handleServiceTypeSelect}
                        field="serviceType"
                        error={null}
                      />
                    </View>

                    {/* Price Slider */}
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
