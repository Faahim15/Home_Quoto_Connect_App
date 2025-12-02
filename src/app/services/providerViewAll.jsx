import { View, Text, ActivityIndicator } from "react-native";
import { useState } from "react";
import CustomHeader from "../components/tabs/home/services/CustomHeader";
import SearchAndFilterBar from "../components/tabs/home/services/SearchAndFilterBar";
import TopServiceProvider from "../components/tabs/home/services/TopServiceProviders";
import { useSearchProvidersQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import ProviderFilterModal from "../components/tabs/home/modal/ProviderFilterModal";
import ProviderSearchResults from "../components/tabs/home/services/ProviderSearchResult";

export default function ServiceProviderScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    minRating: "",
    sortBy: "",
    serviceCategory: "",
  });

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Detect user intention
  const userSearched = searchQuery.trim().length > 0;
  const userFiltered = Object.values(filters).some((v) => v !== "");

  const shouldRunSearchAPI = userSearched || userFiltered;

  console.log("userSearch", searchQuery);

  const { data, isLoading } = useSearchProvidersQuery(
    {
      search: searchQuery, // Changed from searchQuery to search
      minRating: filters.minRating || undefined,
      sortBy: filters.sortBy || undefined,
      serviceCategory: filters.serviceCategory || undefined,
    },
    {
      skip: !shouldRunSearchAPI, // Skip moved to options object
    }
  );

  const providerList = data?.data?.providers || [];

  console.log("providerListsss", providerList.length);

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <CustomHeader title="Service Providers" />

      {/* SEARCH BAR */}
      <SearchAndFilterBar
        onSearch={(text) => setSearchQuery(text)}
        onFilterPress={() => setFilterModalVisible(true)}
      />

      {/* MAIN CONTENT */}
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

      {/* FILTER MODAL */}
      <ProviderFilterModal
        visible={filterModalVisible}
        filters={filters}
        onClose={() => setFilterModalVisible(false)}
        onApply={(updatedFilters) => {
          setFilters(updatedFilters);
          setFilterModalVisible(false);
        }}
        onReset={() => {
          setFilters({
            minRating: "",
            sortBy: "",
            serviceCategory: "",
          });
          setFilterModalVisible(false);
        }}
      />
    </View>
  );
}
