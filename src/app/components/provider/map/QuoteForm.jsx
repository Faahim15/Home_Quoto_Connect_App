import { Text, View, Pressable } from "react-native";
import { scale } from "../../adaptive/Adaptiveness";
import RadioButton from "../home/RadioButton";
import MapTextField from "../home/MapTextField";
import OfferPrice from "../../tabs/home/OfferPrice";
import { formatDateWithOrdinal } from "../../../util/helper-function";
import Error from "../../shared/error/Error";
import { Image } from "expo-image";

export default function QuoteForm({
  radioButtonChange,
  quoteDetailsChange,
  onWarrantyChange,
  onPriceChange,
  onUpdateReasonChange,
  job,
  price,
  errors,
  formData,
  quoteValue,
}) {
  return (
    <View className="mx-[4%] mb-[4%]">
      {/* Service Type Banner */}
      <View
        style={{
          borderTopLeftRadius: scale(8),
          borderTopRightRadius: scale(8),
        }}
        className="px-[3.5%] py-[2.5%] flex-row items-center justify-between bg-gray-500"
      >
        <Text className="text-white font-poppins-400regular text-base">
          {job?.serviceCategory?.title || "N/A"}
        </Text>
      </View>

      <View
        style={{
          borderBottomRightRadius: scale(8),
          borderBottomLeftRadius: scale(8),
        }}
        className="px-[4%] py-[4%] border border-[#DCDCDC] rounded-sm bg-white"
      >
        <Text className="font-poppins-semiBold pb-[2%] text-base text-[#1F2937]">
          Posted by
        </Text>
        <View className="flex-row items-center gap-[4%]">
          <Pressable className="w-16 h-16 mb-[4%] rounded-full bg-blue-500 items-center justify-center">
            <Image
              source={{ uri: job?.profilePicture?.url || null }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </Pressable>
          <View className="flex-1 pb-[2%]">
            <Text className="font-poppins-500medium text-xl text-gray-800 mb-1">
              {job?.client?.fullName}
            </Text>
          </View>
        </View>

        <View>
          {/* Appointment */}
          <View className="mt-[5%]">
            <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
              Appointment
            </Text>
            <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%]">
              Available on {formatDateWithOrdinal(job?.preferredDate)} at{" "}
              {job?.preferredTime}.
            </Text>
          </View>

          {/* ✅ Pass formData.appointment so RadioButton always reflects current state */}
          <RadioButton
            isAvailable={
              formData.appointment !== null
                ? formData.appointment
                : (quoteValue?.isAvailable ?? null)
            }
            radioButtonChange={radioButtonChange}
          />
          <Error error={errors?.appointment} />

          {/* Quote Details */}
          <View className="mt-[3%]">
            <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
              Write Quote Details
            </Text>
            <MapTextField
              value={formData.quoteDetails || quoteValue?.quoteDetails}
              quoteDetailsChange={quoteDetailsChange}
            />
            <Error error={errors?.quoteDetails} />
          </View>

          {/* Warranty & Guarantee */}
          <View className="mt-[3%]">
            <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
              Warranty & Guarantee
            </Text>
            <MapTextField
              value={formData.warrantyDetails || quoteValue?.warranty}
              quoteDetailsChange={onWarrantyChange}
            />
            <Error error={errors?.warrantyDetails} />
          </View>

          {/* Update Reason (conditional) */}
          {onUpdateReasonChange && (
            <View className="mt-[3%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Describe Update Reason
              </Text>
              <MapTextField
                value={formData.updateReason}
                quoteDetailsChange={onUpdateReasonChange}
              />
              <Error error={errors?.updateReason} />
            </View>
          )}

          {/* Price */}
          <View className="flex-row mt-[3%] justify-between">
            <Text className="font-poppins-400regular pt-[4%] text-base text-[#1F2937]">
              Offer your price
            </Text>
            <OfferPrice
              value={price ?? quoteValue?.price}
              onChange={onPriceChange}
            />
          </View>
          <Error error={errors?.price || " "} />
        </View>
      </View>
    </View>
  );
}
