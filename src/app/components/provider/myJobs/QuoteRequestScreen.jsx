import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  scale,
  verticalScale,
} from "../../../components/adaptive/Adaptiveness";
import BottomButtons from "../../shared/services/buttons/BottomButtons";
import CancelModal from "../../../components/shared/modal/CancelModal";
import { toast } from "sonner-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image } from "expo-image";
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

  const handleCancelConfirm = async (reason) => {
    try {
      await cancelJob({ jobId, reason }).unwrap();
      setCancelModalVisible(false);
      router.push("/provider/myJobs");
    } catch (err) {
      toast.error(err?.message || "Please try again.");
    }
  };

  const { profilePhoto, fullName } = item?.job?.client || {};
  const { city, state } = item?.job?.location?.details || {};

  return (
    <Pressable
      style={{ width: scale(327) }}
      className="bg-white border border-[#D4E0EB] px-[4.5%] py-3 rounded-xl shadow-sm overflow-hidden"
      onPress={() =>
        router.push({
          pathname: "/provider/myJobs/quoteRequest",
          params: { quoteId: item?._id, jobId: item?.job?._id },
        })
      }
    >
      {/* ── Avatar + Name ── */}
      <View className="flex-row items-center mb-2">
        {profilePhoto?.url ? (
          <Image
            source={{ uri: profilePhoto.url }}
            style={{
              width: scale(46),
              height: scale(46),
              borderRadius: scale(23),
              flexShrink: 0,
            }}
            contentFit="cover"
            className="bg-gray-200"
          />
        ) : (
          <View
            style={{
              width: scale(46),
              height: scale(46),
              borderRadius: scale(23),
              flexShrink: 0,
            }}
            className="bg-gray-100 items-center justify-center"
          >
            <Ionicons name="person" size={scale(22)} color="#9CA3AF" />
          </View>
        )}

        <View className="flex-1 ml-3">
          <Text
            className="text-gray-900 font-poppins-500medium text-base"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item?.job?.title || "N/A"}
          </Text>
          <Text
            className="font-poppins-400regular text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            by{" "}
            <Text className="text-[#319FCA] font-poppins-400regular text-sm">
              {fullName || "N/A"}
            </Text>
          </Text>
        </View>
      </View>

      {/* ── Divider ── */}
      <View className="border-t border-[#F0F4F8] mb-2" />

      {/* ── Category ── */}
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="construct-outline"
          size={15}
          color="#6B7280"
          style={{ flexShrink: 0, marginRight: 6 }}
        />
        <Text
          className="font-poppins-400regular text-sm text-[#6B7280] flex-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.job?.serviceCategory?.title || "N/A"}
        </Text>
      </View>

      {/* ── Location + Time ── */}
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="location-outline"
          size={15}
          color="#319FCA"
          style={{ flexShrink: 0 }}
        />
        <Text
          className="font-poppins-400regular text-sm text-[#319FCA] flex-1 ml-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {city && state ? `${city}, ${state}` : "Location not specified"}
          <Text className="text-[#6B7280]">
            {" | "}
            {item?.timeAgo || "Just now"}
          </Text>
        </Text>
      </View>

      {/* ── Divider ── */}
      <View className="border-t border-[#F0F4F8] mb-2" />

      {/* ── Price ── */}
      <View className="flex-row justify-between items-center mb-1">
        <Text className="font-poppins-400regular text-base text-[#1F2937]">
          Price
        </Text>
        <Text
          className="font-poppins-semiBold text-base text-[#F59E0B]"
          numberOfLines={1}
        >
          {item?.job?.priceRange?.isPersonalized
            ? "Request a personalized..."
            : `$${item?.job?.priceRange?.from || 0} - $${
                item?.job?.priceRange?.to || 0
              }`}
        </Text>
      </View>

      {/* ── Divider ── */}
      <View className="border-t border-[#F0F4F8] mb-2" />

      {/* ── Buttons ── */}
      <View className="flex-row gap-[2%] mt-1">
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

      {/* ── Cancel Modal ── */}
      <CancelModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
      />
    </Pressable>
  );
};
// ----------------------------------------------------------
// QuotesRequestScreen
// ----------------------------------------------------------
export default function QuotesRequestScreen() {
  const { data, isLoading, error, refetch } = useGetAllQuotesQuery();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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
        <Pressable
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  // ------------------------------------------
  // Empty State
  // ------------------------------------------
  const pendingJobs =
    data?.data?.quotes?.filter((q) => q.status === "pending") || [];

  console.log("pend", pendingJobs);

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
        <Pressable
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Refresh
          </Text>
        </Pressable>
      </View>
    );
  }

  // ------------------------------------------
  // Main List
  // ------------------------------------------
  return (
    <View className="bg-[#f9f9f9] mt-[4%] items-center">
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
