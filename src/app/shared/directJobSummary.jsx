import { Text, View } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
  resetJobPost,
  setJobField,
} from "../../redux/features/jobPost/jobPostSlice";
import ReviewPost from "../components/tabs/jobs/ReviewPost";
import { useBookProviderMutation } from "../../redux/features/apiSlices/quote/quoteApiSlice";
import { useEffect, useState } from "react";

export default function DirectJobSummaryScreen() {
  const jobData = useSelector((state) => state.jobPost);
  const dispatch = useDispatch();
  const [providerId, setProviderId] = useState(null);

  const [bookProvider, { isLoading }] = useBookProviderMutation();

  const [longitude, latitude] = jobData.location.coordinates;
  const specializationIds = jobData?.specializations.map((spec) => spec.id);

  // ✅ Retrieve providerId from AsyncStorage on mount
  useEffect(() => {
    const loadProviderId = async () => {
      try {
        const storedProviderId = await AsyncStorage.getItem("providerId");
        if (storedProviderId) {
          setProviderId(storedProviderId);

          if (!jobData.providerId) {
            dispatch(
              setJobField({ field: "providerId", value: storedProviderId })
            );
          }
        } else {
          console.log("⚠️ No providerId found in AsyncStorage");
        }
      } catch (error) {
        console.error(
          "❌ Error retrieving providerId from AsyncStorage:",
          error
        );
      }
    };

    loadProviderId();
  }, [dispatch, jobData.providerId]);

  // Prepare booking data
  const prepareBookingData = () => {
    const formData = new FormData();

    // 🧾 Append all fields
    formData.append("title", jobData.title);
    formData.append("description", jobData.specificInstructions);
    formData.append("serviceCategory", jobData?.serviceCategory?.id);

    // Specializations
    formData.append("specializations", JSON.stringify(specializationIds));

    // Location
    formData.append("location[type]", "Point");
    formData.append("location[coordinates][0]", longitude);
    formData.append("location[coordinates][1]", latitude);
    formData.append("location[details][houseNumber]", jobData.houseNumber);
    formData.append("location[details][streetNumber]", jobData.streetNumber);
    formData.append(
      "location[details][completeAddress]",
      jobData.completeAddress
    );
    formData.append("location[details][city]", jobData.location.city);
    formData.append("location[details][state]", jobData.location.state);
    formData.append("location[details][country]", jobData.location.country);
    formData.append(
      "location[details][zipCode]",
      jobData?.location?.zipCode || "N/A"
    );
    formData.append("location[address]", jobData.location.address);

    // Date and time
    formData.append("urgency", jobData.urgency);
    formData.append("preferredDate", jobData.preferredDate);
    formData.append("preferredTime", jobData.preferredTime);
    formData.append("specificInstructions", jobData.specificInstructions);

    // Photos
    if (jobData.photos && jobData.photos.length > 0) {
      jobData.photos.forEach((photo, index) => {
        if (photo.uri) {
          formData.append("photos", {
            uri: photo.uri,
            type: photo.type || "image/jpeg",
            name: photo.name || `photo_${index}.jpg`,
          });
        }
      });
    }

    // Price Range
    formData.append("priceRange[from]", jobData.priceRange.from);
    formData.append("priceRange[to]", jobData.priceRange.to);
    formData.append(
      "priceRange[isPersonalized]",
      jobData.priceRange.isPersonalized
    );

    return formData;
  };

  const handleBookProvider = async () => {
    // Use providerId from state or Redux (fallback)
    const finalProviderId = providerId || jobData.providerId;

    // Validate providerId exists
    if (!finalProviderId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Provider ID is missing. Please try again.",
        position: "bottom",
      });
      return;
    }

    try {
      const bookingData = prepareBookingData();

      //   console.log("🚀 Booking provider with ID:", finalProviderId);

      // 🚀 Send booking request to backend
      const response = await bookProvider({
        providerId: finalProviderId,
        body: bookingData,
      }).unwrap();

      // Clear providerId from AsyncStorage after successful booking
      await AsyncStorage.removeItem("providerId");
      console.log("🗑️ Removed providerId from AsyncStorage");

      // Reset job post data
      dispatch(resetJobPost());

      console.log("✅ Provider booked successfully:", response);

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Provider booked successfully!",
        position: "top",
      });

      // Navigate to home page
      router.replace("/home");
    } catch (error) {
      console.error("❌ Booking failed:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error?.data?.message || "Something went wrong. Please try again.",
        position: "bottom",
      });
    }
  };

  return (
    <View className="flex-1 px-[6%] bg-[#F9F9F9]">
      <View>
        <CustomTitle title="Book Provider" />
      </View>
      <View>
        <Text className="font-poppins-500medium text-base">
          Review Booking Details
        </Text>
        <ReviewPost isLoading={isLoading} jobData={jobData} />
      </View>
      <View>
        <CustomButton
          isLoading={isLoading}
          title={isLoading ? "Booking Provider..." : "Book Provider"}
          onPress={handleBookProvider}
        />
      </View>
    </View>
  );
}
