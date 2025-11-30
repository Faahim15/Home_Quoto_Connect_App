import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useGetCreditsActivityQuery } from "../../../../redux/features/apiSlices/payment/paymentApiSlice";

const RecentActivity = () => {
  const {
    data: creditData,
    isLoading: creditLoader,
    error: creditError,
  } = useGetCreditsActivityQuery();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getActivityDescription = (activity) => {
    if (activity.type === "purchase") {
      return (
        activity.description || `Purchased ${activity.creditChange} credits`
      );
    }
    return activity.description;
  };

  if (creditLoader) {
    return (
      <View className="px-[5%] pt-[5%]">
        <Text className="text-xl font-poppins-semiBold mb-[4%] text-black">
          Recent Activity
        </Text>
        <View className="py-8 items-center">
          <ActivityIndicator size="small" color="#5C5F62" />
        </View>
      </View>
    );
  }

  if (creditError) {
    return (
      <View className="px-[5%] pt-[5%]">
        <Text className="text-xl font-poppins-semiBold mb-[4%] text-black">
          Recent Activity
        </Text>
        <Text className="text-center text-red-500 py-4 font-poppins-400regular">
          Failed to load activity
        </Text>
      </View>
    );
  }

  const activities = creditData?.data?.activities || [];

  if (activities.length === 0) {
    return (
      <View className="px-[5%] pt-[5%]">
        <Text className="text-xl font-poppins-semiBold mb-[4%] text-black">
          Recent Activity
        </Text>
        <Text className="text-center text-[#5C5F62] py-4 font-poppins-400regular">
          No recent activity
        </Text>
      </View>
    );
  }

  return (
    <View className="px-[5%] pt-[5%]">
      <Text className="text-xl font-poppins-semiBold mb-[4%] text-black">
        Recent Activity
      </Text>
      <ScrollView className="space-y-[4%]">
        {activities.map((activity) => (
          <View
            key={activity._id}
            className="border-b border-gray-200 pb-[4%] flex-row justify-between items-start"
          >
            <View className="flex-1 pr-[4%]">
              <Text className="text-xs font-poppins-400regular text-[#171717]">
                {getActivityDescription(activity)}
              </Text>
              <Text
                className={`text-base font-poppins-400regular mt-[1%] ${
                  activity.creditChange < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {activity.creditChange > 0
                  ? `+${activity.creditChange} Credit${activity.creditChange !== 1 ? "s" : ""}`
                  : `${activity.creditChange} Credit${activity.creditChange !== -1 ? "s" : ""}`}
              </Text>
            </View>
            <Text className="text-sm text-[#171717] font-poppins-400regular mt-[1%]">
              {formatDate(activity.createdAt)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentActivity;
