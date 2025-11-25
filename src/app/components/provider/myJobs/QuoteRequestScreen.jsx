import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  scale,
  verticalScale,
} from "../../../components/adaptive/Adaptiveness";
import BotttomButtons from "../../shared/services/buttons/BottomButtons";
import CustomButton from "../../shared/services/buttons/ServiceButton";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import CancelModal from "../../../components/shared/modal/CancelModal";
import Toast from "react-native-toast-message";
import { useGetAllQuotesQuery } from "../../../../redux/features/apiSlices/quote/quoteApiSlice";

const ServiceCard = ({ item }) => {
  if (!item?.job) {
    return null;
  }

  if (isLoading) {
  const { profilePhoto, fullName, averageRating } = item?.job?.client || {};
  const { city, state } = item?.job?.location?.details || {};
  const handlePress = useCallback(() => {
    router.push({
      pathname: "/provider/myJobs/quoteRequest",
      params: { serviceId: item.id },
    });
  }, [item]);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const handleCancelConfirm = (reason) => {
    console.log("Cancellation reason:", reason);
  };

  const appointmentData = {
    service: "TV repair",
    provider: "Jackson",
    price: "320",
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ width: scale(327), height: verticalScale(270) }}
      className="bg-white mr-[0.5%] flex-col justify-center border border-[#D4E0EB] px-[4.5%] rounded-xl shadow-sm overflow-hidden"
    >
      <View className="flex-row mt-[2%]">
        {/* User Image */}
        <View className="">
          <Image
            source={{ uri: profilePhoto?.url || null }}
            style={{ width: scale(48), height: verticalScale(48) }}
            className="bg-gray-300 mt-[12%] rounded-full mr-[2%]"
          />
        </View>

        {/* Card Content */}
        <View className="">
          {/* Title */}
          <Text
            className="text-gray-900 font-poppins-500medium text-base mt-[2%]"
            numberOfLines={2}
          >
            {item?.job?.title || "N/A"}
          </Text>

          {/* Author */}
          <View className="flex-row items-center mt-[4%]">
            <Text className="font-poppins-400regular text-sm">
              by{" "}
              <Text className="font-poppins-400regular text-[#319FCA] text-sm">
                {fullName || "N/A"}
              </Text>
            </Text>
          </View>

          {/* Service Type */}
          <View className="flex-row gap-[2%] items-center mt-[4%]">
            <Ionicons name="construct-outline" size={16} color="#6B7280" />
            <Text className="font-poppins-400regular text-sm text-[#6B7280]">
              {item?.job?.serviceCategory?.title || "N/A"}
            </Text>
          </View>

          {/* Location and Time */}
          <View className="flex-row items-center mt-[4%]">
            <Ionicons name="location-outline" size={16} color="#319FCA" />
            <Text className="text-gray-500 text-sm ml-[1%]"></Text>

            <Text className="font-poppins-400regular text-sm text-[#319FCA]">
              {city && state ? `${city}, ${state}` : "N/A"}{" "}
              <Text className="text-[#6B7280]">| {item?.timeAgo}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Price section */}
      <View className="flex-row mt-[4%] justify-between">
        <Text className="font-poppins-400regular text-base text-[#1F2937]">
          Price
        </Text>
        <Text className="font-poppins-semiBold text-base text-[#F59E0B]">
          {item?.job?.priceRange?.isPersonalized
            ? "Request a personalized..."
            : `$${item?.job?.priceRange?.from || null}-$${item?.job?.priceRange?.to || null}`}
        </Text>
      </View>

      {/* buttons section */}
      <View className="flex-row gap-[2%] mt-[5%]">
        <BotttomButtons
          onPress={() => {
            setCancelModalVisible(true);
          }}
          width={145}
          backgroundColor="#fff"
          color="#EF4444"
          borderColor="#EF4444"
          title="Cancel"
        />

        <BotttomButtons
          onPress={() => {
            Toast.show({
              type: "success",
              text1: "Offer Accepted",
              text2: "You've successfully accepted the offer.",
              position: "top",
              topOffset: 60,
              visibilityTime: 3000,
            });
            router.replace("/provider/home");
          }}
          width={145}
          backgroundColor="#fff"
          color="#175994"
          borderColor="#175994"
          title="Accept offer"
        />
      </View>

      {/* {!item.requiresPersonalizedQuote && (
        <View className="flex-1">
          <CustomButton
            onPress={() => router.push("/provider/quote/updateQuote")}
            title="Update Quote"
          />
        </View> 

        : (
          <BotttomButtons
            onPress={() => router.push("/provider/quote/updateQuote")}
            width={145}
            backgroundColor="#fff"
            color="#175994"
            borderColor="#175994"
            title="Update Quote"
          />
        )}
      )} */}

      <CancelModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
        appointmentDetails={appointmentData}
      />
    </TouchableOpacity>
  );
};

export default function QuotesRequestScreen() {
  const { data, isLoading, error, refetch } = useGetAllQuotesQuery();
  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9]">
        <ActivityIndicator size="large" color="#175994" />
        <Text className="font-poppins-400regular text-sm text-gray-600 mt-4">
          Loading quotes...
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="font-poppins-600semiBold text-lg text-gray-900 mt-4 text-center">
          Unable to Load Quotes
        </Text>
        <Text className="font-poppins-400regular text-sm text-gray-600 mt-2 text-center">
          {error?.data?.message || "Something went wrong. Please try again."}
        </Text>
        <TouchableOpacity
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
        <Text className="font-poppins-600semiBold text-lg text-gray-900 mt-4 text-center">
          No Quotes Available
        </Text>
        <Text className="font-poppins-400regular text-sm text-gray-600 mt-2 text-center">
          You don't have any quote requests at the moment.
        </Text>
        <TouchableOpacity
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Refresh
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  const pendingJobs =
    data?.data?.quotes?.filter((job) => job.status === "pending") ?? [];

  // console.log(pendingJobs.length);

  return (
    <View className="justify-center items-center bg-[#f9f9f9] mt-[4%]">
      <FlatList
        data={pendingJobs}
        renderItem={({ item }) => <ServiceCard item={item} />}
        keyExtractor={(item, idx) => item._id || idx.toString()}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(100),
          rowGap: verticalScale(12),
        }}
        snapToAlignment="start"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#175994"]} // Android
            tintColor="#175994" // iOS
          />
        }
      />
    </View>
  );
}
