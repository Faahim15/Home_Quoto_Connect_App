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
import BottomButtons from "../../shared/services/buttons/BottomButtons";
import CancelModal from "../../../components/shared/modal/CancelModal";
import Toast from "react-native-toast-message";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  useGetAllQuotesQuery,
  useRemoveQuoteMutation,
} from "../../../../redux/features/apiSlices/quote/quoteApiSlice";

// ----------------------------------------------------------
// ServiceCard Component
// ----------------------------------------------------------
const ServiceCard = ({ item }) => {
  if (!item?.job || !item?.job?.isDirectBooking) return null;

  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const [cancelJob, { isLoading: cancelLoading }] = useRemoveQuoteMutation();

  const jobId = item?._id;

  // ---------------------------
  // Cancel Job
  // ---------------------------
  const handleCancelConfirm = async (reason) => {
    try {
      await cancelJob({ jobId, reason }).unwrap();
      setCancelModalVisible(false);
      router.push("/provider/myJobs");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Cancellation Failed",
        text2: err?.message || "Please try again.",
      });
    }
  };

  const { profilePhoto, fullName } = item?.job?.client || {};
  const { city, state } = item?.job?.location?.details || {};

  return (
    <TouchableOpacity
      style={{ width: scale(327), height: verticalScale(230) }}
      className="bg-white flex-col border border-[#D4E0EB] px-[4.5%] rounded-xl shadow-sm overflow-hidden"
      onPress={() =>
        router.push({
          pathname: "/provider/myJobs/quoteRequest",
          params: { quoteId: item?._id, jobId: item?.job?._id },
        })
      }
    >
      <View className="flex-row mt-[2%]">
        {/* User Image */}
        <Image
          source={{ uri: profilePhoto?.url || undefined }}
          style={{ width: scale(48), height: verticalScale(48) }}
          className="bg-gray-300 mt-[2%] rounded-full mr-[2%]"
        />

        {/* Main Content */}
        <View>
          {/* Job Title */}
          <Text
            className="text-gray-900 font-poppins-500medium text-base mt-[2%]"
            numberOfLines={2}
          >
            {item?.job?.title || "N/A"}
          </Text>

          {/* Client Name */}
          <View className="flex-row items-center mt-[4%]">
            <Text className="font-poppins-400regular text-sm">
              by{" "}
              <Text className="text-[#319FCA] font-poppins-400regular text-sm">
                {fullName || "N/A"}
              </Text>
            </Text>
          </View>

          {/* Category */}
          <View className="flex-row gap-[2%] items-center mt-[4%]">
            <Ionicons name="construct-outline" size={16} color="#6B7280" />
            <Text className="font-poppins-400regular text-sm text-[#6B7280]">
              {item?.job?.serviceCategory?.title || "N/A"}
            </Text>
          </View>

          {/* Location + Time */}
          <View className="flex-row items-center mt-[4%]">
            <Ionicons name="location-outline" size={16} color="#319FCA" />
            <Text className="font-poppins-400regular text-sm text-[#319FCA] ml-[1%]">
              {city && state ? `${city}, ${state}` : "N/A"}{" "}
              <Text className="text-[#6B7280]">| {item?.timeAgo}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Price */}
      <View className="flex-row mt-[4%] justify-between">
        <Text className="font-poppins-400regular text-base text-[#1F2937]">
          Price
        </Text>
        <Text className="font-poppins-semiBold text-base text-[#F59E0B]">
          {item?.job?.priceRange?.isPersonalized
            ? "Request a personalized..."
            : `$${item?.job?.priceRange?.from || 0} - $${
                item?.job?.priceRange?.to || 0
              }`}
        </Text>
      </View>

      {/* Buttons */}
      <View className="flex-row mb-[2%] gap-[2%] mt-[4%]">
        <BottomButtons
          onPress={() => setCancelModalVisible(true)}
          width={145}
          backgroundColor="#fff"
          color="#EF4444"
          borderColor="#EF4444"
          title="Cancel"
          loading={cancelLoading}
        />

        <BottomButtons
          onPress={() =>
            router.push({
              pathname: "/provider/quote/provideUpdatedOffer",
              params: { jobId: item?.job?._id },
            })
          }
          width={145}
          backgroundColor="#fff"
          color="#175994"
          borderColor="#175994"
          title="Send Offer"
        />
      </View>

      {/* Cancel Modal */}
      <CancelModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
      />
    </TouchableOpacity>
  );
};

// ----------------------------------------------------------
// QuotesRequestScreen
// ----------------------------------------------------------
export default function QuotesRequestScreen() {
  const { data, isLoading, error, refetch } = useGetAllQuotesQuery();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh when screen focuses
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Pull to Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // ------------------------------------------
  // Loading State
  // ------------------------------------------
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

  // ------------------------------------------
  // Error State
  // ------------------------------------------
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="font-poppins-600semiBold text-lg text-gray-900 mt-4 text-center">
          Unable to Load Quotes
        </Text>
        <Text className="font-poppins-400regular text-sm text-gray-600 mt-2 text-center">
          {error?.message || "Something went wrong. Please try again."}
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

  // ------------------------------------------
  // Empty State
  // ------------------------------------------
  const pendingJobs =
    data?.data?.quotes?.filter((q) => q.status === "pending") || [];

  if (pendingJobs.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />

        <Text className="font-poppins-500medium text-lg text-gray-900 mt-4 text-center">
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

  // ------------------------------------------
  // Main List
  // ------------------------------------------
  return (
    <View className=" bg-[#f9f9f9] mt-[4%] items-center">
      <FlatList
        data={pendingJobs}
        renderItem={({ item }) => <ServiceCard item={item} />}
        keyExtractor={(item, idx) => item._id || idx.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(100),
          rowGap: verticalScale(12),
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#175994"]}
            tintColor="#175994"
          />
        }
      />
    </View>
  );
}
