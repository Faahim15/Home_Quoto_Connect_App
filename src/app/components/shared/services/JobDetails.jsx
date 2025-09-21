import { View, Text, Image, FlatList } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import XStyle from "../../../util/styles";
import { imagesData } from "../../data/shared/ServicesData";

function showImages({ item }) {
  return (
    <View>
      <Image
        source={item.image}
        style={{
          width: scale(90),
          height: verticalScale(80),
          borderRadius: scale(4),
        }}
      />
    </View>
  );
}
export default function ProviderInfo({ serviceData, showPrice = false }) {
  const {
    price,
    profileImage,
    providerName,
    rating,
    reviews,
    serviceType,
    timeAgo,
    designation,
    bookingDate,
    bookingHours,
    specializations,
    description,
    address,
    quoteOption,
  } = serviceData;

  return (
    <View
      style={XStyle.shadowBox}
      className="py-[4%] px-[3%] mt-[3%] bg-white border border-[#D4E0EB] "
    >
      <View>
        <Text className="font-poppins-500medium text-base text-[#565656] ">
          {serviceType}
        </Text>
        <View className="border-b border-[#CACACA] mb-[2%] mt-[3%] ">
          <Image
            style={{ width: scale(310), height: verticalScale(177) }}
            className="rounded-md  mb-[2%] "
            source={require("../../../../../assets/images/home/jobs/summary1.png")}
          />
        </View>
        <View className="mt-[1%]">
          <FlatList
            data={imagesData}
            renderItem={showImages}
            keyExtractor={(item) => item.id}
            horizontal
            ItemSeparatorComponent={() => (
              <View style={{ paddingRight: scale(10) }} />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View className="flex-col border-b border-[#CACACA] mb-[2%] w-full overflow-hidden">
          <View className="flex-col gap-[6%] mt-[3%]">
            <Text className="font-poppins-500medium text-xs text-[#5C5F62]">
              Job Details
            </Text>
            <Text className="font-poppins-400regular text-justify text-xs text-[#5C5F62] ">
              {description}
            </Text>
          </View>
          {/* Service */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Service
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {designation}
            </Text>
          </View>
          {/* Specializations */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Specializations
            </Text>
            <View className="flex-row overflow-hidden flex-wrap">
              {specializations.slice(0, 2).map((item, idx, arr) => (
                <Text
                  className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]"
                  key={idx}
                >
                  {item + (idx !== arr.length - 1 ? ", " : "")}
                </Text>
              ))}
            </View>
          </View>
          {/* {(showCompleteJob || showButtons) && (
            <View className="flex-row overflow-hidden mt-[3%] w-full justify-between">
              <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
                Address
              </Text>
              <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
                {address.split(",").slice(-2).join(", ")}{" "}
              </Text>
            </View>
          )} */}
          {/* Booking Date */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking date
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {bookingDate}
            </Text>
          </View>
          {/* Booking hours */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking Hours
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {bookingHours}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text className="font-poppins-semiBold text-base text-[#1F2937]">
          Posted by
        </Text>
        <View>
          <View className="flex-row gap-[4%] pb-[2%] border-b border-[#CACACA] ">
            <Image
              style={{
                width: scale(40),
                height: verticalScale(40),
                borderRadius: scale(20),
              }}
              source={{
                uri: profileImage || "https://via.placeholder.com/300",
              }}
              className="mt-[2%]"
            />
            <View className="mt-[2%]">
              <Text className="font-poppins-500medium text-xl text-[#1F2937]">
                {providerName}
              </Text>
            </View>
          </View>
          {/* Price and Time */}
          {showPrice && (
            <View className="flex-row pt-[1%] justify-between">
              <Text className="font-poppins-400regular text-base text-[#1F2937]">
                Price
              </Text>
              <Text className="text-[#F59E0B] text-base font-poppins-semiBold">
                {quoteOption === "Accept"
                  ? price
                  : "Request a personalized quote"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
