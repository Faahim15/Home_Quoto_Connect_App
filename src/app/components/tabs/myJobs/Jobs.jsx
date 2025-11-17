import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { useState } from "react";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { router } from "expo-router";
import { useGetAllJobsQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";
import LoadingState from "../../ui/LoadingState";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";

// Updated ServiceItem component with navigation
const ServiceItem = ({ item, quote }) => {
  const { fullName, averageRating, profilePhoto, totalReviews, _id } =
    quote?.provider;

  return (
    <View className="mx-[4%] mb-[4%]">
      {/* Service Type Banner - Made clickable */}
      <Pressable
        style={{
          borderTopLeftRadius: scale(8),
          borderTopRightRadius: scale(8),
        }}
        className="px-[3.5%] py-[3%] flex-row items-center justify-between bg-gray-500"
      >
        <Text className="text-white font-poppins-400regular text-base">
          {item?.serviceCategory?.title || "N/A"}
        </Text>
      </Pressable>

      <View
        style={{
          borderBottomRightRadius: scale(8),
          borderBottomLeftRadius: scale(8),
        }}
        className="px-[4%] py-[4%] border border-[#DCDCDC] rounded-sm bg-white"
      >
        <View className="flex-row items-center gap-[4%]">
          {/* Profile Image */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/services/providerDetails",
                params: { profileId: _id, showButtons: true },
              })
            }
            style={{ width: scale(80), height: verticalScale(80) }}
            className="mb-[10%] rounded-full bg-blue-500 items-center justify-center"
          >
            <Image
              source={{
                uri: profilePhoto?.url || null,
              }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Provider Details */}
          <View className="flex-1">
            <Text className="font-poppins-500medium text-xl text-gray-800 mb-1">
              {fullName || "N/A"}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center mb-[2%]">
              <Text className="text-[#F59E0B] font-poppins-400regular text-xs mr-1">
                ★ {Number(averageRating) / 10 || "N/A"}
              </Text>
              <Text className="font-poppins-400regular text-[#18649F] text-xs">
                ({totalReviews > 1 ? "Reviews" : "Review" || "N/A"})
              </Text>
            </View>

            {/* Price and Time */}
            <View className="flex-row justify-between">
              <Text className="font-poppins-400regular text-base text-[#1F2937]">
                Price
              </Text>
              <Text className="text-[#F59E0B] text-base font-poppins-semiBold">
                {quote?.price
                  ? `$${quote.price}`
                  : "Request a personalized quote"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "myJobs/quotesDetails",
                  params: { quoteId: quote?._id, quoteReq: true },
                })
              }
              style={{ width: scale(120), height: verticalScale(30) }}
              className="bg-[#0054A5] justify-center items-center mt-[3%] rounded-md py-[2%] px-[2%]"
            >
              <Text className="font-poppins-500medium text-[10px] text-white text-sm font-semibold">
                Details
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-end  w-full">
              <Text className="text-gray-500 text-sm">
                {quote?.timeAgo || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Updated Services component with pull-to-refresh
export default function Services() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useGetAllJobsQuery();

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing services:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  // Extract jobs data with fallback
  const jobsData = data?.data?.jobs || [];

  const quoteData =
    jobsData.length > 0
      ? jobsData.filter((item) => item?.status !== "in_progress")
      : null;

  // Filter jobs that have quotes AND filter out jobs with any accepted quotes
  const filteredQuotes = Array.isArray(quoteData)
    ? quoteData.filter((job) => {
        // Check if job has quotes
        if (!Array.isArray(job.quotes) || job.quotes.length === 0) {
          return false;
        }

        // Filter out jobs that have any quote with status "accepted"
        const hasAcceptedQuote = job.quotes.some(
          (quote) => quote.status === "pending"
        );

        return hasAcceptedQuote;
      })
    : [];

  // Handle empty state
  if (filteredQuotes.length === 0) {
    return <EmptyState />;
  }

  const quoteItems = filteredQuotes.flatMap((job) =>
    job.quotes.map((quote) => ({
      quote,
      job, // preserve job context
    }))
  );

  const renderServiceItem = ({ item }) => {
    const { quote, job } = item;
    return <ServiceItem item={job} quote={quote} />;
  };

  return (
    <View className="mb-[18%]">
      <FlatList
        data={quoteItems}
        renderItem={renderServiceItem}
        keyExtractor={(item, index) => item.quote._id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: scale(16),
          paddingBottom: scale(20),
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#175994"]} // Android
            tintColor="#175994" // iOS
            progressBackgroundColor="#ffffff" // Android
          />
        }
      />
    </View>
  );
}
