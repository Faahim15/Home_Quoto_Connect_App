import { View, Image, Text } from "react-native";
import { scale } from "../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";

export default function ContractorDetails({ userData }) {
  const isVerified = userData?.verificationStatus === "verified";
  const rating = userData?.averageRating
    ? (Number(userData.averageRating) / 10).toFixed(1)
    : "0.0";

  return (
    <View>
      {/* ── Title ── */}
      <Text className="font-poppins-semiBold text-lg text-[#2B54A4] mb-4">
        My Profile
      </Text>

      <View className="flex-row justify-between items-center">
        {/* ── Avatar + Info ── */}
        <View className="flex-row items-center gap-4">
          {/* Avatar */}
          {userData?.profilePhoto?.url ? (
            <Image
              source={{ uri: userData.profilePhoto.url }}
              style={{
                width: scale(80),
                height: scale(80),
                borderRadius: scale(40),
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: scale(80),
                height: scale(80),
                borderRadius: scale(40),
              }}
              className="bg-gray-100 border border-gray-200 justify-center items-center"
            >
              <Ionicons name="person" size={38} color="#9CA3AF" />
            </View>
          )}

          {/* ── Name + Business + Rating ── */}
          <View className="gap-1">
            {/* Name + Verified */}
            <View className="flex-row items-center gap-1.5">
              <Text
                className="font-poppins-semiBold text-base text-[#1F2937]"
                numberOfLines={1}
              >
                {userData?.fullName
                  ? userData.fullName.split(" ").slice(0, 2).join(" ")
                  : "N/A"}
              </Text>
              {isVerified ? (
                <Ionicons name="checkmark-circle" size={17} color="#2B54A4" />
              ) : (
                <View className="bg-gray-100 px-1.5 py-0.5 rounded-md">
                  <Text className="font-poppins-400regular text-[9px] text-gray-500">
                    Unverified
                  </Text>
                </View>
              )}
            </View>

            {/* Business Name */}
            {userData?.businessName ? (
              <Text
                className="font-poppins-400regular text-xs text-gray-500"
                numberOfLines={1}
              >
                {userData.businessName}
              </Text>
            ) : null}

            {/* ── Rating ── */}
            <View className="flex-row items-center gap-1 mt-0.5">
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text className="font-poppins-500medium pt-[3px] text-xs text-[#F59E0B]">
                {rating}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Credits Badge ── */}
        <View
          className="flex-row items-center bg-white border-2 border-[#2B54A4] rounded-full px-3 py-2 gap-1.5"
          style={{ elevation: 2 }}
        >
          <Ionicons name="wallet-outline" size={18} color="#2B54A4" />
          <Text className="text-[#2B54A4] font-poppins-bold text-sm">
            {userData?.credits ?? 0}
          </Text>
        </View>
      </View>
    </View>
  );
}
