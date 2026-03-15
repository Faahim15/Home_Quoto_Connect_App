import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import CustomTitle from "../components/shared/services/CustomTitle";
import RenderHtml from "react-native-render-html"; // You'll need to install this package
import { useWindowDimensions } from "react-native";
import { useGetContentQuery } from "../../redux/features/apiSlices/user/userApiSlices";

export default function PrivacyScreen() {
  const { width } = useWindowDimensions();

  // Fetch terms and conditions content from API
  const { data, isLoading, error } = useGetContentQuery("privacy_policy"); // Adjust content type as needed

  if (isLoading) {
    return (
      <View className="flex-1 px-[6%] bg-[#F9F9F9] justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 font-poppins-400regular text-[#333333]">
          Loading Terms and Conditions...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 px-[6%] bg-[#F9F9F9] justify-center items-center">
        <Text className="font-poppins-400regular text-red-500 text-center">
          Failed to load Terms and Conditions. Please try again later.
        </Text>
      </View>
    );
  }

  const content = data?.data?.content;

  const lastUpdated = new Date(content?.updatedAt).toLocaleDateString();

  return (
    <View className="flex-1 px-[6%] bg-[#F9F9F9]">
      <View>
        {/* Last updated info */}
        {content?.updatedAt && (
          <Text className="font-poppins-400regular text-xs text-[#666666] mt-2">
            Last updated: {lastUpdated}
          </Text>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-[1%] mt-[3%]">
          {/* Render HTML content if available */}
          {content?.content ? (
            <RenderHtml
              contentWidth={width - 48} // Adjust for padding
              source={{ html: content.content }}
              baseStyle={{
                fontFamily: "Poppins-400",
                fontSize: 14,
                color: "#333333",
                textAlign: "justify",
                lineHeight: 20,
              }}
              tagsStyles={{
                p: { marginBottom: 16 },
                h1: {
                  fontFamily: "Poppins-600",
                  fontSize: 18,
                  marginBottom: 12,
                  marginTop: 8,
                },
                h2: {
                  fontFamily: "Poppins-600",
                  fontSize: 16,
                  marginBottom: 10,
                  marginTop: 8,
                },
                h3: {
                  fontFamily: "Poppins-500",
                  fontSize: 14,
                  marginBottom: 8,
                  marginTop: 6,
                },
                strong: { fontFamily: "Poppins-600" },
                em: { fontFamily: "Poppins-400Italic" },
                ul: { marginBottom: 16 },
                ol: { marginBottom: 16 },
                li: { marginBottom: 4 },
              }}
            />
          ) : (
            // Fallback content if no API content
            <Text className="font-poppins-400regular text-justify text-sm text-[#333333]">
              Terms and conditions content is not available at the moment.
              Please check back later or contact support.
            </Text>
          )}


        </View>
      </ScrollView>
    </View>
  );
}
