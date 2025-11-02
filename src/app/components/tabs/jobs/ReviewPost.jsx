import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import XStyle from "../../../util/styles";
import services, { specializations as S } from "../../data/jobs/CategoryIds";

function showImages({ item }) {
  // ✅ uri properly handle করুন
  let imageSource;

  if (item.uri) {
    imageSource = { uri: String(item.uri) }; // ✅ String() দিয়ে cast
  } else if (item.image) {
    // item.image যদি number হয় (require() থেকে)
    imageSource =
      typeof item.image === "number" ? item.image : { uri: String(item.image) };
  } else {
    imageSource = null; // বা fallback image
  }

  return (
    <View>
      <Image
        source={imageSource}
        style={{
          width: scale(90),
          height: verticalScale(80),
          borderRadius: scale(4),
        }}
        resizeMode="cover"
      />
    </View>
  );
}

export default function ReviewPost({ jobData, isLoading }) {
  // ✅ Conditional rendering - যদি jobData থাকে
  if (isLoading || !jobData) {
    return (
      <View
        style={XStyle.shadowBox}
        className="py-[4%] px-[3%] mt-[3%] bg-white border border-[#D4E0EB] justify-center items-center"
      >
        <View className="flex-col items-center justify-center py-8">
          <ActivityIndicator
            size="large"
            color="#175994"
            style={{ marginBottom: scale(16) }}
          />
          <Text className="font-poppins-500medium text-base text-[#565656]">
            Loading Job Details...
          </Text>
          <Text className="font-poppins-400regular text-xs text-[#6B7280] mt-2">
            Please wait while we prepare your job summary
          </Text>
        </View>
      </View>
    );
  }

  const {
    specificInstructions,
    serviceCategory,
    specializations,
    preferredDate,
    preferredTime,
    title,
    photos,
  } = jobData;
  const { address } = jobData?.location;
  const { isPersonalized, from, to } = jobData?.priceRange;

  // ✅ Fix photoData logic
  const photoData = photos && photos?.length > 0 ? photos : null;

  // ✅ Fix main image logic
  const mainImageSource =
    photos && photos?.length > 0 && photos[0].uri
      ? { uri: photos[0].uri }
      : null;

  return (
    <View
      style={XStyle.shadowBox}
      className="py-[4%] px-[3%] mt-[3%] bg-white border border-[#D4E0EB] "
    >
      <View>
        <Text className="font-poppins-500medium text-base text-[#565656] ">
          {title || "N/A"}
        </Text>

        {/* ✅ Fix main image */}
        <View className="border-b border-[#CACACA] mb-[2%] mt-[3%] ">
          <Image
            style={{ width: scale(310), height: verticalScale(177) }}
            className="rounded-md mb-[2%]"
            source={mainImageSource}
          />
        </View>

        {/* ✅ Fix FlatList - check if photoData has items */}
        {photoData && photoData.length > 0 && (
          <View className="mt-[1%]">
            <FlatList
              data={photoData}
              renderItem={showImages}
              keyExtractor={(item) =>
                item.id || item.uri || Math.random().toString()
              }
              horizontal
              ItemSeparatorComponent={() => (
                <View style={{ paddingRight: scale(10) }} />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View className="flex-col border-b border-[#CACACA] mb-[2%] w-full overflow-hidden">
          <View className="flex-col gap-[6%] mt-[3%]">
            <Text className="font-poppins-500medium text-xs text-[#5C5F62]">
              Job Details
            </Text>
            <Text className="font-poppins-400regular text-justify text-xs text-[#5C5F62] ">
              {specificInstructions || "N/A"}
            </Text>
          </View>

          {/* Service */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Service
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {jobData?.serviceCategory?.title}
            </Text>
          </View>

          {/* Specializations */}
          <View className="flex-row mt-[3%] justify-between">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Specializations
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {specializations[0]?.title} {`+${specializations?.length - 1}`}
            </Text>
          </View>

          <View className="flex-row mt-[3%] w-[70%] gap-[25%] ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Address
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {address || "N/A"}
            </Text>
          </View>

          {/* Booking Date */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking date
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {preferredDate || "N/A"}
            </Text>
          </View>

          {/* Booking hours */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking Hours
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {preferredTime || "N/A"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <Text className="font-poppins-semiBold text-sm text-[#565656] ">
            Price
          </Text>
          <Text
            className={`font-poppins-semiBold text-sm ${isPersonalized ? "text-[#F59E0B]" : "text-[#175994]"} `}
          >
            {isPersonalized
              ? "Request a personalized quote"
              : `$${from || 0} - $${to || 0}`}
          </Text>
        </View>
      </View>
    </View>
  );
}
