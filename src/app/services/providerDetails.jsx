import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import ArrowBack from "../components/auth/ArrowBack";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import TimeSlot from "../components/tabs/home/services/provider/details/TimeSlot";
import Gallery from "../components/tabs/home/services/provider/details/Gallery";
import Banner from "../components/tabs/home/services/provider/details/Banner";
import PerfomanceMetrics from "../components/tabs/home/services/provider/details/PerfomanceMetrics";
import Skills from "../components/tabs/home/services/provider/details/Skills";
import Testimonials from "../components/tabs/home/services/provider/details/Testimonials";
import ReviewButton from "../components/tabs/home/services/provider/details/ReviewButton";
import Biography from "../components/tabs/home/services/provider/details/Biography";
import { router, useLocalSearchParams } from "expo-router";
import XStyle from "../util/styles";
import Toast from "react-native-toast-message";
import {
  useGetPopularProvidersQuery,
  useGetProviderDetailsQuery,
} from "../../redux/features/apiSlices/user/createJobSlices";
export default function ProviderDetailsScreen() {
  const { showButtons, profileId } = useLocalSearchParams();

  // console.log("provider Id", profileId);

  // console.log("This is from Quote id", profileId);

  const { data, isLoading, error } = useGetProviderDetailsQuery(profileId);

  // console.log("data", data?.data?.phoneNumber);

  const shouldShowButtons = showButtons === "true";

  // Add loading state check
  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#18649F" />
        <Text className="font-poppins-500medium text-sm text-[#565656] mt-4">
          Loading provider details...
        </Text>
      </View>
    );
  }
  // Add error state check (optional)
  if (error) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-[6%]">
        <Text className="font-poppins-semiBold text-base text-[#EF4444] text-center">
          Failed to load provider details
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-[#18649F] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    profilePhoto,
    workingHours,
    fullName,
    businessName,
    bio,
    experienceLevel,
    averageRating,
    totalCompletedJobs,
    specializations,
  } = data?.data?.provider || {};

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(40) }}
        className="flex-1 "
      >
        {/* Banner */}

        <LinearGradient
          colors={["#319FCA", "#18649F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-md overflow-hidden relative"
          style={{
            height: verticalScale(344),
            borderBottomLeftRadius: scale(16),
            borderBottomRightRadius: scale(16),
          }}
        >
          <View className="w-10 h-10 mx-[6%] mt-[6%] rounded-[20px] bg-white ">
            <ArrowBack />
          </View>
          <View className="flex-1 justify-center items-center ">
            <Image
              source={{ uri: profilePhoto?.url }}
              style={{
                width: scale(264),
                height: verticalScale(290),
                marginTop: verticalScale(0),
                marginLeft: scale(30),
              }}
              resizeMode="cover"
            />
          </View>
        </LinearGradient>

        <Banner
          providerId={data?.data?.provider._id}
          data={{ name: fullName, designation: businessName }}
        />

        {/* PerfomanceMetrics */}

        <PerfomanceMetrics
          performanceData={{
            avgRating: averageRating,
            totalJobs: totalCompletedJobs,
            experienceLevel,
          }}
        />

        {/* Skills */}

        <Skills specializations={specializations} />

        {/* Book button */}

        {!shouldShowButtons && (
          <View className="px-[6%]">
            <CustomButton
              onPress={() =>
                router.push({
                  pathname: "/shared/directBooking",
                  params: { providerId: profileId },
                })
              }
              title="Book"
            />
          </View>
        )}

        {/* Time Solt */}
        <View className="mx-[6%] mt-[3%] ">
          <Text className="font-poppins-semiBold text-base text-[#565656]">
            Available
          </Text>
        </View>
        <View className="flex-row justify-start gap-[3%] mx-[6%] mt-[3%] ">
          <TimeSlot time={workingHours?.from} />
          <View>
            <Text className="font-poppins-semiBold pt-[2%] text-base text-[#919191] ">
              To
            </Text>
          </View>
          <TimeSlot time={workingHours?.to} />
        </View>

        {/* Bio  */}
        <Biography bio={bio} />

        {/* Gallery Section */}
        <View>
          <View className="flex-row justify-between mx-[6%] mt-[3%] ">
            <Text className="font-poppins-semiBold text-base text-[#565656]">
              Gallery
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/services/showGallery",
                  params: { id: profileId },
                })
              }
            >
              <Text className="font-poppins-500medium text-base text-[#175994]">
                View all
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Images section */}
        <Gallery portfolioImages={data?.data?.portfolio} />

        {/* Reviews */}
        <Testimonials testimonialData={data?.data} />

        {/* Review Button */}
        <ReviewButton
          id={profileId}
          totalReviews={data?.data?.reviews.length}
        />
      </ScrollView>
      {shouldShowButtons && (
        <View
          className="flex-row gap-[6%] h-[14%]  border border-[#D8DCE0] justify-center items-center "
          style={[
            XStyle.shadowBox,
            { borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20) },
          ]}
        >
          <BotttomButtons
            onPress={() => {
              Toast.show({
                type: "info",
                text1: "Request Declined",
                text2: "The provider has been notified of your decision",
                position: "top",
                visibilityTime: 3000,
              });
              router.back();
            }}
            backgroundColor="#fff"
            color="#EF4444"
            borderColor="#EF4444"
            title="Decline"
          />
          <BotttomButtons
            onPress={() => router.back()}
            backgroundColor="#18649F"
            color="#fff"
            borderColor="#18649F"
            title="Accept"
          />
        </View>
      )}
    </View>
  );
}
