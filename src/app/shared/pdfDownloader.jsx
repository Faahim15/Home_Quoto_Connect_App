import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import InvoiceHeader from "../components/shared/invoice/InvoiceHeader";
import ServiceInfo from "../components/shared/invoice/ServiceInfo";
import Service from "../components/shared/invoice/Service";
import Pricing from "../components/shared/invoice/Pricing";
import PaymentInfo from "../components/shared/invoice/PaymentInfo";
import InvoiceButton from "../components/shared/invoice/InvoiceButton";
import { router, useLocalSearchParams } from "expo-router";
import { verticalScale } from "../components/adaptive/Adaptiveness";
import {
  avatar1,
  avatar2,
  locationIcon,
  settingsIcon,
} from "../../../assets/svg/icons";
import { useGetJobInvoiceQuery } from "../../redux/features/apiSlices/payment/paymentApiSlice";
import moment from "moment";

const InvoiceScreen = () => {
  const { jobId } = useLocalSearchParams();

  const { data: invoice, isLoading, error } = useGetJobInvoiceQuery(jobId);

  const { name, fullName, email, phoneNumber, address } =
    invoice?.data?.serviceProvider || {};
  const {
    name: serviceName,
    fullName: customerName,
    email: customerEmail,
    phoneNumber: customerPhone,
    address: customerAdrress,
  } = invoice?.data?.customer || {};
  const { jobTitle, jobDescription, jobLocation, serviceCategory } =
    invoice?.data?.jobDetails || {};
  const { subtotal, platformCommission, platformCommissionRate, total } =
    invoice?.data?.pricing || {};
  const { paidAmount, paymentMethod, paymentStatus, paidAt } =
    invoice?.data?.payment || {};
  const formatted = moment(invoice?.data?.issuedDate).format("MMMM D, YYYY");

  const generateHTMLInvoice = () => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          @page {
            size: A4;
            margin: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
          .invoice-container {
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            flex-direction: column;
          }
          .header {
            background: #2196F3;
            color: white;
            padding: 15px 20px;
            text-align: center;
          }
          .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
          }
          .header p {
            font-size: 11px;
            margin: 2px 0;
          }
          .section {
            padding: 12px 20px;
            border-bottom: 1px solid #eee;
          }
          .section-title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #444;
          }
          .info-block p {
            font-size: 11px;
            line-height: 1.4;
            color: #444;
            margin: 2px 0;
          }
          .pricing-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 11px;
          }
          .pricing-row.total {
            border-top: 2px solid #2196F3;
            padding-top: 8px;
            margin-top: 5px;
            font-size: 14px;
            font-weight: bold;
            color: #2196F3;
          }
          .payment-status {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            margin-top: 5px;
            margin-bottom: 5px;
            font-size: 10px;
          }
          .footer {
            text-align: center;
            padding: 15px;
            font-size: 10px;
            color: #777;
            background: #f9f9f9;
            margin-top: auto;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>INVOICE</h1>
            <p>#INV-${invoice?.data?.invoiceId}</p>
            <p>${formatted}</p>
          </div>

          <div class="section">
            <div class="section-title">Service Provider</div>
            <div class="info-block">
              <p><strong>${fullName || ""}</strong></p>
              <p>${address || ""}</p>
              <p>📞 ${phoneNumber || ""}</p>
              <p>📧 ${email || ""}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Customer</div>
            <div class="info-block">
              <p><strong>${customerName || ""}</strong></p>
              <p>${customerAdrress || ""}</p>
              <p>📞 ${customerPhone || ""}</p>
              <p>📧 ${customerEmail || ""}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Service Details</div>
            <div class="info-block">
              <p><strong>${jobTitle || ""}</strong></p>
              <p>${jobDescription || ""}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Work Location</div>
            <div class="info-block">
              <p>${jobLocation || ""}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Pricing Breakdown</div>
            <div class="pricing-row">
              <span>Platform Commission</span>
              <span>$${platformCommission || ""}</span>
            </div>
            <div class="pricing-row">
              <span>Platform Commission Rate</span>
              <span>${platformCommissionRate || ""}</span>
            </div>
            <div class="pricing-row">
              <span>Subtotal</span>
              <span>$${subtotal || ""}</span>
            </div>
            <div class="pricing-row total">
              <span>Total Amount</span>
              <span>$${total || ""}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Payment Information</div>
            <div class="info-block">
              <div class="payment-status">${paymentStatus || ""}</div>
              <p><strong>Payment Method:</strong> ${paymentMethod?.charAt(0).toUpperCase() + paymentMethod?.slice(1) || ""}</p>
              <p><strong>Amount Paid:</strong> $${paidAmount || ""}</p>
            </div>
          </div>

          <div class="footer">
            <p>For questions regarding this invoice, please contact support.</p>
            <p>Thank you for your business!</p>
          </div>
        </div>
      </body>
    </html>
  `;
  };

  const downloadInvoicePDF = async () => {
    try {
      // Generate PDF file
      const { uri } = await Print.printToFileAsync({
        html: generateHTMLInvoice(),
        base64: false,
      });

      const fileName = `Invoice_${invoice?.data?.invoiceId.replace(
        "#",
        ""
      )}_${Date.now()}.pdf`;

      const newUri = FileSystem.documentDirectory + fileName;

      // Move PDF to accessible documentDirectory
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      // Check if sharing is supported
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          "Sharing Not Available",
          "Sharing is not available on this device."
        );
        return;
      }

      // Share PDF (Android fix included)
      await Sharing.shareAsync(newUri, {
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
        dialogTitle: "Share or Save Invoice PDF",
      });

      router.back();
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to download invoice. Please try again.");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading Invoice...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Unable to Load Invoice</Text>
        <Text style={styles.errorText}>
          {error?.data?.message || "Something went wrong. Please try again."}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-[#F9FAFB]">
        <ScrollView
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
          showsVerticalScrollIndicator={false}
        >
          <InvoiceHeader
            invoiceId={invoice?.data?.invoiceId}
            issueDate={invoice?.data?.issuedDate}
          />
          <ServiceInfo
            serviceDetails={{
              svgIcon: avatar1,
              name: fullName,
              role: "Service Provider",
              serviceType: name,
              address: address,
              phone: phoneNumber,
              gmail: email,
            }}
          />
          <ServiceInfo
            serviceDetails={{
              svgIcon: avatar2,
              name: serviceName,
              role: "Customer",
              address: customerAdrress,
              phone: customerPhone,
              gmail: customerEmail,
            }}
          />

          {/* sevice details */}

          <Service
            services={{
              svgIcon: settingsIcon,
              title: "Service Details",
              subtitle: jobTitle,
              description: jobDescription,
            }}
          />
          {/* location details */}
          <Service
            services={{
              svgIcon: locationIcon,
              title: "Work Location",
              description: jobLocation,
            }}
          />
          {/* pricing breakdown */}
          <Pricing pricing={invoice?.data?.pricing} />

          {/* payment information */}
          <PaymentInfo paymentInfo={invoice?.data?.payment} />
        </ScrollView>
        {/* button */}
        <InvoiceButton onPress={downloadInvoicePDF} isLoading={isLoading} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default InvoiceScreen;
