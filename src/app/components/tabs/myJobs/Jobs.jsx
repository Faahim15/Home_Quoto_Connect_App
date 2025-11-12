import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
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
  // console.log("id", _id);
  const serviceColors = {
    "TV repair and Installation": "bg-[#319FCA]",
    "AC Repair and Maintenance": "bg-[#FF6B6B]",
    "Plumbing Services": "bg-[#10B981]",
    "Electrical Repair": "bg-[#8B5CF6]",
  };

  return (
    <View className="mx-[4%] mb-[4%]">
      {/* Service Type Banner - Made clickable */}
      <Pressable
        style={{
          borderTopLeftRadius: scale(8),
          borderTopRightRadius: scale(8),
        }}
        className={`px-[3.5%] py-[3%] flex-row items-center justify-between ${
          serviceColors[item?.serviceType] || "bg-gray-500"
        }`}
      >
        <Text className="text-white font-poppins-400regular text-base">
          {item?.serviceCategory?.title || "N/A"}
        </Text>

        {/* <Ionicons name="arrow-forward" size={16} color="#fff" /> */}
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
            className=" mb-[10%] rounded-full bg-blue-500 items-center justify-center"
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
              className={` justify-center items-center  mt-[3%] rounded-md py-[2%] px-[2%] ${serviceColors[item?.serviceType] || "bg-[#0054A5]"} `}
            >
              <Text className=" font-poppins-500medium text-[10px]  text-white text-sm font-semibold">
                Details
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-end w-full">
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

// Updated Services component with navigation prop
export default function Services() {
  const { data, isLoading, error } = useGetAllJobsQuery();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  // Extract jobs data with fallback
  const jobsData = data?.data?.jobs || data?.data || [];
  const quoteData = jobsData.length > 0 ? jobsData : null;

  // Filter jobs that have quotes
  const filteredQuotes = Array.isArray(quoteData)
    ? quoteData.filter(
        (job) => Array.isArray(job.quotes) && job.quotes.length > 0
      )
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
        keyExtractor={(item, index) => item._id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: scale(16),
          paddingBottom: scale(20),
        }}
      />
    </View>
  );
}
