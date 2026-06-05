import { View, Text, ActivityIndicator } from "react-native";
import { useState } from "react";
import CustomHeader from "../components/tabs/home/services/CustomHeader";
import SearchAndFilterBar from "../components/tabs/home/services/SearchAndFilterBar";
import TopServiceProvider from "../components/tabs/home/services/TopServiceProviders";
import {
  useSearchProvidersQuery,
  useGetServiceCategoriesQuery,
} from "../../redux/features/apiSlices/user/createJobSlices";
import ProviderFilterModal from "../components/tabs/home/modal/ProviderFilterModal";
import ProviderSearchResults from "../components/tabs/home/services/ProviderSearchResult";
import CustomTitle from "../components/shared/CustomTitle";
export default function ServiceProviderScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    minRating: "",
    serviceCategory: "",
  });

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const { data: categoryData } = useGetServiceCategoriesQuery();
  const categories = categoryData?.data?.categories || [];

  const selectedCategoryId = filters.serviceCategory
    ? categories.find((cat) => cat.title === filters.serviceCategory)?._id
    : undefined;

  const userSearched = searchQuery.trim().length > 0;
  const userFiltered = Object.values(filters).some((v) => v !== "");

  const shouldRunSearchAPI = userSearched || userFiltered;

  const { data, isLoading } = useSearchProvidersQuery(
    {
      search: searchQuery,
      minRating: filters.minRating || undefined,
      serviceCategory: selectedCategoryId,
    },
    {
      skip: !shouldRunSearchAPI,
    },
  );

  const providerList = data?.data?.providers || [];

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <CustomTitle title="Popular Service Providers" withSafeTop={true} />

      <SearchAndFilterBar
        onSearch={(text) => setSearchQuery(text)}
        onFilterPress={() => setFilterModalVisible(true)}
      />

      <View className="flex-1">
        {!shouldRunSearchAPI ? (
          <TopServiceProvider />
        ) : isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0054A5" />
          </View>
        ) : (
          <ProviderSearchResults providers={providerList} />
        )}
      </View>

      <ProviderFilterModal
        visible={filterModalVisible}
        filters={filters}
        onClose={() => setFilterModalVisible(false)}
        onApply={(updatedFilters) => {
          setFilters(updatedFilters);
          // setFilterModalVisible(false);
        }}
        onReset={() => {
          setFilters({
            minRating: "",
            serviceCategory: "",
          });
          // setFilterModalVisible(false);
        }}
      />
    </View>
  );
}
