import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useSearchProvidersQuery } from "../../../../../redux/features/apiSlices/user/createJobSlices";
// import { useSearchProvidersQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";

export default function ProviderSearchResults({ search, filters }) {
  const params = {
    ...filters,
    search: search || undefined,
  };

  const { data, isLoading, isError } = useSearchProvidersQuery(params);

  if (isLoading) return <ActivityIndicator size="large" className="mt-10" />;

  if (isError)
    return (
      <Text className="text-center mt-10 text-red-500">
        Something went wrong
      </Text>
    );

  if (!data?.providers?.length)
    return (
      <Text className="text-center mt-10 text-gray-500">
        No providers found
      </Text>
    );

  return (
    <FlatList
      data={data.providers}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View className="bg-white p-4 m-3 rounded-xl shadow">
          <Text className="font-poppins-medium">{item.name}</Text>
          <Text className="text-gray-500">{item.category}</Text>
        </View>
      )}
    />
  );
}
