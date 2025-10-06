import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import QuoteReqData from "../../data/jobs/QuotesData";
import { router } from "expo-router";
// Updated ServiceItem component with navigation
const ServiceItem = ({ item }) => {
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
          {item.serviceType}
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
                params: { showButtons: true },
              })
            }
            style={{ width: scale(80), height: verticalScale(80) }}
            className=" mb-[10%] rounded-full bg-blue-500 items-center justify-center"
          >
            <Image
              source={{
                uri: item.profileImage,
              }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Provider Details */}
          <View className="flex-1">
            <Text className="font-poppins-500medium text-xl text-gray-800 mb-1">
              {item.providerName}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center mb-[2%]">
              <Text className="text-[#F59E0B] font-poppins-400regular text-xs mr-1">
                ★ {item.rating}
              </Text>
              <Text className="font-poppins-400regular text-[#18649F] text-xs">
                ({item.reviews} Reviews)
              </Text>
            </View>

            {/* Price and Time */}
            <View className="flex-row justify-between">
              <Text className="font-poppins-400regular text-base text-[#1F2937]">
                Price
              </Text>
              <Text className="text-[#F59E0B] text-base font-poppins-semiBold">
                {item.price}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "myJobs/quotesDetails",
                  params: { serviceId: item.id, quoteReq: true },
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
              <Text className="text-gray-500 text-sm">{item.timeAgo}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Updated Services component with navigation prop
export default function Services() {
  const renderServiceItem = ({ item }) => {
    return <ServiceItem item={item} />;
  };

  return (
    <View className="mb-[18%]">
      <FlatList
        data={QuoteReqData}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: scale(16),
          paddingBottom: scale(20),
        }}
      />
    </View>
  );
}
