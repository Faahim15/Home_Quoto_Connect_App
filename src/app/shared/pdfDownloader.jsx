import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
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

const InvoiceScreen = () => {
  const { jobId } = useLocalSearchParams();
  console.log(jobId);

  const { data: invoice, isLoading, error } = useGetJobInvoiceQuery(jobId);

  console.log("invoice", invoice);
  const invoiceData = {
    invoiceNumber: "#INV-123456",
    date: "March 16, 2024",
    serviceProvider: {
      name: "John Doe Plumbing Services",
      address: "123 Main Street, Toronto, ON M5V 3T6",
      phone: "(416) 555-0123",
      email: "john@plumbingservices.com",
    },
    customer: {
      name: "Jane Smith",
      address: "456 Oak Avenue, Toronto, ON M6W 1A8",
      phone: "(416) 555-0456",
      email: "jane.smith@email.com",
    },
    serviceDetails: {
      title: "Plumbing Service - Leak Fixing",
      description:
        "Fixed water leaking under the sink in the kitchen and replaced the old pipes with a new one. Tested all connections for proper sealing.",
    },
    location: "456 Oak Avenue, Toronto, ON M6W 1A8",
    pricing: {
      plumbingService: 150.0,
      pipeReplacement: 50.0,
      hst: 26.0,
      subtotal: 200.0,
      total: 226.0,
    },
    paymentInfo: {
      status: "Paid",
      amount: 226.0,
      method: "Paid through app",
      date: "March 16, 2024",
    },
  };

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
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              background: #f5f5f5;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              overflow: hidden;
            }
            .header {
              background: #2196F3;
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              font-size: 32px;
              margin-bottom: 10px;
            }
            .section {
              padding: 20px;
              border-bottom: 1px solid #eee;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #444;
            }
            .info-block p {
              font-size: 14px;
              line-height: 1.6;
              color: #444;
            }
            .pricing-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
            }
            .pricing-row.total {
              border-top: 2px solid #2196F3;
              padding-top: 12px;
              margin-top: 8px;
              font-size: 18px;
              font-weight: bold;
              color: #2196F3;
            }
            .payment-status {
              display: inline-block;
              background: #4CAF50;
              color: white;
              padding: 6px 16px;
              border-radius: 20px;
              margin-top: 10px;
              font-size: 12px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #777;
              background: #f9f9f9;
            }
          </style>
        </head>
        <body>

          <div class="invoice-container">

            <div class="header">
              <h1>INVOICE</h1>
              <p>${invoiceData.invoiceNumber}</p>
              <p>${invoiceData.date}</p>
            </div>

            <div class="section">
              <div class="section-title">Service Provider</div>
              <div class="info-block">
                <p><strong>${invoiceData.serviceProvider.name}</strong></p>
                <p>${invoiceData.serviceProvider.address}</p>
                <p>📞 ${invoiceData.serviceProvider.phone}</p>
                <p>📧 ${invoiceData.serviceProvider.email}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Customer</div>
              <div class="info-block">
                <p><strong>${invoiceData.customer.name}</strong></p>
                <p>${invoiceData.customer.address}</p>
                <p>📞 ${invoiceData.customer.phone}</p>
                <p>📧 ${invoiceData.customer.email}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Service Details</div>
              <div class="info-block">
                <p><strong>${invoiceData.serviceDetails.title}</strong></p>
                <p>${invoiceData.serviceDetails.description}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Work Location</div>
              <div class="info-block">
                <p>${invoiceData.location}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Pricing Breakdown</div>

              <div class="pricing-row">
                <span>Plumbing Service</span>
                <span>$${invoiceData.pricing.plumbingService.toFixed(2)}</span>
              </div>

              <div class="pricing-row">
                <span>Pipe Replacement</span>
                <span>$${invoiceData.pricing.pipeReplacement.toFixed(2)}</span>
              </div>

              <div class="pricing-row">
                <span>HST (13%)</span>
                <span>$${invoiceData.pricing.hst.toFixed(2)}</span>
              </div>

              <div class="pricing-row">
                <span>Subtotal</span>
                <span>$${invoiceData.pricing.subtotal.toFixed(2)}</span>
              </div>

              <div class="pricing-row total">
                <span>Total Amount</span>
                <span>$${invoiceData.pricing.total.toFixed(2)}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Payment Information</div>
              <div class="info-block">
                <div class="payment-status">${invoiceData.paymentInfo.status}</div>
                <p><strong>Payment Method:</strong> ${invoiceData.paymentInfo.method}</p>
                <p><strong>Amount Paid:</strong> $${invoiceData.paymentInfo.amount.toFixed(2)}</p>
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

      const fileName = `Invoice_${invoiceData.invoiceNumber.replace(
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

  return (
    <>
      <View className="flex-1 bg-[#F9FAFB]">
        <ScrollView
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
          showsVerticalScrollIndicator={false}
        >
          <InvoiceHeader />
          <ServiceInfo
            serviceDetails={{
              svgIcon: avatar1,
              name: "John Doe",
              role: "Service Provider",
              serviceType: "Plumbing Services",
              address: "123 Main Street, Toronto, ON M5V 2T6",
              phone: "(416) 555-0123",
              gmail: "john@doeplumbing.com",
            }}
          />
          <ServiceInfo
            serviceDetails={{
              svgIcon: avatar2,
              name: "Jane Smith",
              role: "Customer",
              address: "456 Oak Avenue, Toronto, ON M4W 1A8",
              phone: "(416) 555-0456",
              gmail: "jane.smith@email.com",
            }}
          />

          {/* sevice details */}

          <Service
            services={{
              svgIcon: settingsIcon,
              title: "Service Details",
              subtitle: "Plumbing Service – Leak Fixing",
              description:
                "Fixed water leakage under the sink in the kitchen and replaced the old pipe with a new one. Tested all connections for proper sealing.",
            }}
          />
          {/* location details */}
          <Service
            services={{
              svgIcon: locationIcon,
              title: "Work Location",
              description: "456 Oak Avenue, Toronto, ON M4W 1A8",
            }}
          />
          {/* pricing breakdown */}
          <Pricing />

          {/* payment information */}
          <PaymentInfo />
        </ScrollView>
        {/* button */}
        <InvoiceButton onPress={downloadInvoicePDF} />
      </View>

      {/* <View style={styles.container}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={downloadInvoicePDF}
        >
          <Text style={styles.downloadButtonText}>
            📥 Download Invoice as PDF
          </Text>
        </TouchableOpacity>
      </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  downloadButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default InvoiceScreen;
