import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import HomeTopBar from "../../components/tabs/home/HomeTopBar";
import { useState } from "react";
import FilterModal from "../../components/provider/home/FilteringModal";
import ShowAllServiceCards from "../../components/tabs/home/services/provider/showAllServices";
import SearchBar from "../../components/tabs/home/SearchBar";
import JobsHeader from "../../components/provider/home/JobsHeader";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import { useUserProfileQuery } from "../../../redux/features/apiSlices/user/userApiSlices";
import {
  useGetActiveJobsQuery,
  useGetAllJobsQuery,
  useGetTodaysJobsQuery,
} from "../../../redux/features/apiSlices/user/createJobSlices";
import FilterHeader from "../../components/provider/home/FilterHeader";

export default function ContractorHomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

 
  const [filters, setFilters] = useState({
    serviceType: "",
    minPrice: undefined,
    maxPrice: undefined,
    search: "",
    sortBy: "createdAt",
  });

  const [searchText, setSearchText] = useState("");

 
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfileQuery();

  const {
    data: todaysJobs,
    isLoading: todaysJobsLoading,
    refetch: refetchTodaysJobs,
  } = useGetTodaysJobsQuery();

  const {
    data: activeJobs,
    isLoading: activeJobsLoading,
    refetch: refetchActiveJobs,
  } = useGetActiveJobsQuery();




  const {
    data: allJobs,
    isLoading: allJobsLoading,
    error,
    refetch: refetchAllJobs,
  } = useGetAllJobsQuery(
    {
      ...filters,
    },
    {
      skip: !hasActiveFilters, 
    }
  );
 
  const handleSearchChange = (text) => {
    setSearchText(text);


    if (text.length >= 3) {
      const updatedFilters = {
        serviceType: "",
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: "createdAt",
        search: text, 
      };

      setFilters(updatedFilters);
      setHasActiveFilters(true); 
    } else {
     
      const clearedFilters = {
        serviceType: "",
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: "createdAt",
        search: "", // no search
      };

      setFilters(clearedFilters);
      setHasActiveFilters(false); 
    }
  };


  const checkIfOtherFiltersActive = (filterObj) => {
    return (
      filterObj.serviceType !== "" ||
      filterObj.minPrice !== undefined ||
      filterObj.maxPrice !== undefined ||
      filterObj.search !== ""
    );
  };


  const handleApplyFilters = (newFilters) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
    };
    setFilters(updatedFilters);
    setHasActiveFilters(checkIfOtherFiltersActive(updatedFilters));
    setShowModal(false);
  };


  const handleClearFilters = () => {
    setFilters({
      serviceType: "",
      minPrice: undefined,
      maxPrice: undefined,
      urgent: undefined,
      specializations: "",
      sortBy: "createdAt",
      search: "", 
    });

    setSearchText(""); 

    setHasActiveFilters(false); 
  };

  const handleSearchSubmit = () => {
    const trimmed = searchText.trim();

    if (trimmed.length >= 3) {
      setFilters({
        serviceType: "",
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: "createdAt",
        search: trimmed,
      });

      setHasActiveFilters(true);
    } else {

      setFilters({
        serviceType: "",
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: "createdAt",
        search: "",
      });

      setHasActiveFilters(false);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const promises = [
        refetchProfile(),
        refetchTodaysJobs(),
        refetchActiveJobs(),
      ];

     
      if (hasActiveFilters) {
        promises.push(refetchAllJobs());
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };


  if (profileLoading || todaysJobsLoading || activeJobsLoading) {
    return (
      <View className="flex-1 bg-[#F9FAFB] justify-center items-center">
        <View className="flex-col items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#175994"
            style={{ marginBottom: 16 }}
          />
          <Text className="font-poppins-500medium text-base text-[#565656]">
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  const userData = profile?.data?.user || null;

  function modalCloseHanlder() {
    setShowModal(false);
  }



  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View>
        <HomeTopBar userData={userData} />
      </View>
      <SearchBar
        onPress={() => setShowModal(true)}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearchSubmit}
      />

 
      {hasActiveFilters && (
        <>
          {/* <JobsHeader
            title="Filtered Results"
            count={allJobs?.data?.jobs?.length || 0}
          /> */}
          <FilterHeader
            title="Filtered Results"
            count={allJobs?.data?.jobs?.length || 0}
          />

          <View>
            {allJobsLoading ? (
              <View className="py-10 items-center">
                <ActivityIndicator size="small" color="#175994" />
                <Text className="font-poppins-400regular text-sm text-gray-500 mt-2">
                  Searching...
                </Text>
              </View>
            ) : allJobs?.data?.jobs?.length > 0 ? (
              <ShowAllServiceCards
                jobs={allJobs?.data?.jobs}
                horizontal={false}
              />
            ) : (
              <View className="py-10 px-6 items-center">
                <Text className="font-poppins-500medium text-base text-gray-600 text-center">
                  No jobs found matching your filters
                </Text>
                <Text className="font-poppins-400regular text-sm text-gray-500 text-center mt-2">
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          </View>
        </>
      )}

      <ScrollView
        contentContainerStyle={{
          paddingBottom: verticalScale(40),
          backgroundColor: "#f9f9f9",
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#175994"]}
            tintColor="#175994" 
            progressBackgroundColor="#ffffff" 
          />
        }
      >
      
        {!hasActiveFilters && (
          <>
            <JobsHeader title="Today's Jobs" />
            <View>
              <ShowAllServiceCards
                jobs={todaysJobs?.data?.jobs}
                horizontal={true}
              />
            </View>

            {/* Active jobs */}
            <JobsHeader title="Active Jobs" />
            <View>
              <ShowAllServiceCards
                jobs={activeJobs?.data?.jobs}
                horizontal={true}
              />
            </View>
          </>
        )}

        <FilterModal
          visible={showModal}
          onClose={modalCloseHanlder}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          currentFilters={filters}
        />
      </ScrollView>
    </View>
  );
}
