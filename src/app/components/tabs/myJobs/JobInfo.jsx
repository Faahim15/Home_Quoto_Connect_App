import { View, Text, Image, FlatList } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import XStyle from "../../../util/styles";
import { imagesData } from "../../data/shared/ServicesData";
import { formatDateForCanada } from "../../../util/helper-function";

function showImages({ item }) {
  return (
    <View>
      <Image
        source={{ uri: item?.url }}
        style={{
          width: scale(90),
          height: verticalScale(80),
          borderRadius: scale(4),
        }}
      />
    </View>
  );
}
export default function JobInfo({ item }) {
  const { city, state } = item?.location?.details || {};

  // console.log("sevice", item);
  // ✅ Fix main image logic
  const mainImageSource =
    item?.photos && item?.photos?.length > 0 && item.photos[0].url
      ? { uri: item.photos[0].url }
      : null;

  // console.log("mainImage", item?.photos);

  return (
    <View
      style={XStyle.shadowBox}
      className="py-[4%] px-[3%] mt-[3%] bg-white border border-[#D4E0EB] "
    >
      <View>
        <Text className="font-poppins-500medium text-base text-[#565656] ">
          {item?.serviceCategory?.title || "N/A"}
        </Text>
        <View className="border-b border-[#CACACA] mb-[2%] mt-[3%] ">
          <Image
            style={{ width: scale(310), height: verticalScale(177) }}
            className="rounded-md  mb-[2%] "
            source={{ uri: mainImageSource.uri }}
          />
        </View>
        {item.photos && item.photos.length > 0 && (
          <View className="mt-[1%]">
            <FlatList
              data={item?.photos}
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
              {item?.description || "N/A"}
            </Text>
          </View>
          {/* Service */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Service
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {item?.serviceCategory?.title || "N/A"}
            </Text>
          </View>
          {/* Specializations */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Specializations
            </Text>
            <View className="flex-row overflow-hidden flex-wrap">
              <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
                {item?.specializations[0]?.title}{" "}
                {item?.specializations?.length > 1
                  ? `+${item.specializations.length - 1}`
                  : ""}
              </Text>
            </View>
          </View>

          <View className="flex-row overflow-hidden mt-[3%] w-full justify-between">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Address
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {city && state ? `${city}, ${state}` : "N/A"}
            </Text>
          </View>

          {/* Booking Date */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking date
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {formatDateForCanada(item?.preferredDate) || "N/A"}
            </Text>
          </View>
          {/* Booking hours */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking Hours
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {item?.preferredTime || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <View>
        {/* Price and Time */}

        <View className="flex-row pt-[1%] justify-between">
          <Text className="font-poppins-400regular text-base text-[#1F2937]">
            Price
          </Text>
          <Text className="text-[#F59E0B] text-base font-poppins-semiBold">
            {item?.priceRange?.isPersonalized
              ? "Request a personalized..."
              : `$${item?.priceRange?.from || null}-$${item?.priceRange?.to || null}`}
          </Text>
        </View>
      </View>
    </View>
  );
}
