import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import {
  useGetWalletQuery,
  useSetupStripeConnectMutation,
} from "../../../redux/features/apiSlices/payment/paymentApiSlice";
import CustomTitle from "../../components/shared/services/CustomTitle";

const StripePayment = () => {
  const [setupStripeConnect, { isLoading: isSettingUp }] =
    useSetupStripeConnectMutation();
  const {
    data: walletData,
    isLoading: isLoadingWallet,
    refetch,
    isFetching,
  } = useGetWalletQuery();
  const [refreshing, setRefreshing] = useState(false);

  const handleSetupStripeConnect = async () => {
    try {
      const result = await setupStripeConnect({}).unwrap();

      if (result?.success && result?.data?.accountLink?.url) {
        // Open Stripe onboarding URL
        const url = result.data.accountLink.url;
        const canOpen = await Linking.canOpenURL(url);

        if (canOpen) {
          await Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open Stripe onboarding link");
        }
      } else {
        Alert.alert(
          "Error",
          result?.message || "Failed to setup Stripe Connect"
        );
      }
    } catch (error) {
      Alert.alert(
        "Setup Failed",
        error?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoadingWallet) {
    return (
      <View className="flex-1 bg-[#F9F9F9] items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-gray-600">
          Loading wallet information...
        </Text>
      </View>
    );
  }

  const wallet = walletData?.data?.wallet;
  const recentTransactions = walletData?.data?.recentTransactions || [];
  const statistics = walletData?.data?.statistics;

  const isConnected = wallet?.stripeAccountId;
  const accountStatus = wallet?.stripeAccountStatus;

  // Format currency
  const formatCurrency = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "verified":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "refunded":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-[#F9F9F9]"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#4F46E5"]}
        />
      }
    >
      <View className="px-6 py-6">
        {/* Account Status Card */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View
              className={`w-12 h-12 rounded-full items-center justify-center ${isConnected ? "bg-green-100" : "bg-gray-100"}`}
            >
              <Ionicons
                name={isConnected ? "checkmark-circle" : "wallet-outline"}
                size={24}
                color={isConnected ? "#10B981" : "#6B7280"}
              />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-poppins-bold text-gray-900">
                {isConnected ? "Connected" : "Not Connected"}
              </Text>
              <Text className="text-xs text-gray-600 font-poppins-400regular mt-1 capitalize">
                {isConnected
                  ? `Status: ${accountStatus || "Active"}`
                  : "No Stripe account connected"}
              </Text>
            </View>
          </View>

          {isConnected && (
            <View className="bg-green-50 rounded-lg p-4 mt-2">
              <Text className="text-green-800 font-poppins-400regular text-xs">
                ✓ Your Stripe account is successfully connected and ready to
                receive payments.
              </Text>
            </View>
          )}
        </View>

        {/* Balance Overview */}
        {isConnected && wallet && (
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <Text className="text-gray-600 font-poppins-400regular text-sm mb-4">
              Wallet Balance
            </Text>

            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <Text className="text-gray-500 font-poppins-400regular text-xs mb-1">
                  Available
                </Text>
                <Text className="text-2xl font-poppins-bold text-gray-900">
                  {formatCurrency(wallet.availableBalance)}
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-gray-500 font-poppins-400regular text-xs mb-1">
                  Pending
                </Text>
                <Text className="text-xl font-poppins-semiBold text-yellow-600">
                  {formatCurrency(wallet.pendingBalance)}
                </Text>
              </View>
            </View>

            <View className="border-t border-gray-200 pt-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600 font-poppins-400regular text-sm">
                  Total Earned
                </Text>
                <Text className="text-gray-900 font-poppins-semiBold ">
                  {formatCurrency(wallet.totalEarned)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 font-poppins-400regular text-sm">
                  Withdrawn
                </Text>
                <Text className="text-gray-900 font-poppins-semiBold">
                  {formatCurrency(wallet.withdrawnBalance)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Statistics */}
        {isConnected && statistics && (
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-poppins-semiBold text-gray-900 mb-4">
              This Month
            </Text>

            <View className="flex-row justify-between">
              <View className="flex-1 bg-blue-50 rounded-xl p-4 mr-3">
                <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                <Text className="text-2xl font-poppins-bold text-blue-900 mt-2">
                  {statistics.this_month.totalBookings}
                </Text>
                <Text className="text-blue-700 text-xs mt-1">Bookings</Text>
              </View>

              <View className="flex-1 bg-green-50 rounded-xl p-4">
                <Ionicons name="cash-outline" size={20} color="#10B981" />
                <Text className="text-2xl font-poppins-bold text-green-900 mt-2">
                  {formatCurrency(statistics.this_month.totalEarnings)}
                </Text>
                <Text className="text-green-700 font-poppins-400regular text-xs mt-1">
                  Earnings
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        {isConnected && recentTransactions.length > 0 && (
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-poppins-semiBold text-gray-900">
                Recent Transactions
              </Text>
              <Text className="text-xs font-poppins-400regular text-gray-500">
                {recentTransactions.length} transactions
              </Text>
            </View>

            {recentTransactions.slice(0, 5).map((transaction, index) => (
              <View
                key={transaction._id}
                className={`py-3 ${index !== recentTransactions.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-sm font-poppins-500medium text-gray-900 capitalize">
                        {transaction.metadata?.type ||
                          transaction.paymentMethod}
                      </Text>
                      <View
                        className={`ml-2 px-2 py-0.5 rounded ${getStatusColor(transaction.status)}`}
                      >
                        <Text className="text-xs font-poppins-400regular capitalize">
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs font-poppins-400regular text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </Text>
                  </View>

                  <Text
                    className={`text-base font-poppins-semiBold ${transaction.status === "refunded" ? "text-red-600" : "text-gray-900"}`}
                  >
                    {transaction.status === "refunded" && "-"}$
                    {transaction.amount.toFixed(2)}
                  </Text>
                </View>

                {transaction.metadata?.credits && (
                  <Text className="text-xs font-poppins-400regular text-gray-500 mt-1">
                    {transaction.metadata.credits} credits
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View className="space-y-4">
          {!isConnected ? (
            <TouchableOpacity
              onPress={handleSetupStripeConnect}
              disabled={isSettingUp}
              className={`bg-indigo-600 rounded-xl py-4 px-6 flex-row items-center justify-center ${isSettingUp ? "opacity-60" : ""}`}
              activeOpacity={0.7}
            >
              {isSettingUp ? (
                <>
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-poppins-semiBold text-base ml-3">
                    Setting up...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={20} color="white" />
                  <Text className="text-white font-poppins-semiBold text-base ml-2">
                    Setup Stripe Connect
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSetupStripeConnect}
              disabled={isSettingUp}
              className={`bg-indigo-600  rounded-xl py-4 px-6 flex-row items-center justify-center ${isSettingUp ? "opacity-60" : ""}`}
              activeOpacity={0.7}
            >
              {isSettingUp ? (
                <>
                  <ActivityIndicator color="#4B5563" size="small" />
                  <Text className="text-gray-700 font-poppins-semiBold text-base ml-3">
                    Updating...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="settings-outline" size={20} color="#fff" />
                  <Text className="text-white font-poppins-semiBold text-base ml-2">
                    Manage Account
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Info Section */}
        {!isConnected && (
          <View className="mt-6 bg-blue-50 rounded-xl p-5">
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#3B82F6"
              />
              <View className="ml-3 flex-1">
                <Text className="text-blue-900 font-semibold mb-2">
                  How it works
                </Text>
                <Text className="text-blue-800 text-sm leading-5">
                  1. Click "Setup Stripe Connect" to begin{"\n"}
                  2. Complete the onboarding process on Stripe{"\n"}
                  3. Return here to start receiving payments{"\n"}
                  4. Funds will be deposited to your connected account
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default StripePayment;
