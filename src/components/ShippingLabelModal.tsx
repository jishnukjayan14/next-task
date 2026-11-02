"use client";

import React, { useEffect, useState, useRef } from "react";
import { Order } from "@/context/StoreContext";
import QRCode from "qrcode";
import { Printer, X, QrCode as QrIcon, CheckCircle } from "lucide-react";

interface ShippingLabelModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!order) return;

    // Generate QR code text with full order and customer details
    const qrText = [
      `--- NEXT TASK SHIPPING MANIFEST ---`,
      `Order ID: ${order.orderNumber}`,
      `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
      `Customer: ${order.shippingAddress?.fullName || "N/A"}`,
      `Phone: ${order.shippingAddress?.phone || "N/A"}`,
      `Address: ${order.shippingAddress?.addressLine || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} - ${order.shippingAddress?.pincode || ""}`,
      `Items: ${order.items.map((i) => `${i.product.title} (Qty: ${i.quantity})${i.customText ? ` [Custom Name: "${i.customText}"]` : ""}`).join("; ")}`,
      `Amount Paid: Rs. ${order.totalAmount}`,
      `Payment Ref: ${order.razorpayPaymentId || "Razorpay Verified"}`,
      `Status: ${order.fulfillmentStatus}`,
    ].join("\n");

    QRCode.toDataURL(qrText, {
      width: 260,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [order]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    // Open a dedicated clean print window tailored for compact label printing (4x6" / A6)
    const printWindow = window.open("", "_blank", "width=500,height=700");
    if (!printWindow) {
      alert("Please allow popups to print shipping labels.");
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #e5e5e5; font-size: 11px;">
          <td style="padding: 6px 4px; font-weight: bold;">
            ${item.product.title}
            ${
              item.customText
                ? `<div style="margin-top: 3px; font-family: Georgia, serif; font-weight: bold; background: #000; color: #fff; display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px;">
                    EMBOSS: "${item.customText}"
                   </div>`
                : ""
            }
          </td>
          <td style="padding: 6px 4px; text-align: center; font-family: monospace;">${item.quantity}</td>
          <td style="padding: 6px 4px; text-align: right; font-family: monospace;">Rs. ${item.product.price * item.quantity}</td>
        </tr>
      `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Label - ${order.orderNumber}</title>
        <style>
          @page {
            size: 100mm 150mm; /* Standard 4x6" / A6 compact shipping label */
            margin: 4mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 8px;
            color: #000;
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .label-container {
            border: 2px solid #000;
            border-radius: 4px;
            padding: 10px;
            box-sizing: border-box;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          .header-left {
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }
          .header-right {
            font-size: 11px;
            font-family: monospace;
            font-weight: bold;
          }
          .section {
            border-bottom: 1px dashed #000;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          .section-title {
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #555;
            margin-bottom: 3px;
          }
          .address-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 2px;
          }
          .address-text {
            font-size: 11px;
            line-height: 1.35;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
          }
          .footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 8px;
            padding-top: 6px;
          }
          .qr-box {
            text-align: center;
          }
          .qr-img {
            width: 85px;
            height: 85px;
            display: block;
            margin: 0 auto;
          }
          .qr-caption {
            font-size: 8px;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 2px;
          }
          .badge {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <!-- Header -->
          <div class="header">
            <div>
              <div class="header-left">NEXT TASK</div>
              <div style="font-size: 8px; color: #555; letter-spacing: 0.5px;">HANDCRAFTED STATIONERY</div>
            </div>
            <div class="header-right" style="text-align: right;">
              <span class="badge">PREPAID</span>
              <div style="font-size: 9px; margin-top: 3px;">#${order.orderNumber}</div>
            </div>
          </div>

          <!-- Deliver To -->
          <div class="section">
            <div class="section-title">SHIP TO (DELIVERY ADDRESS):</div>
            <div class="address-name">${order.shippingAddress?.fullName || "Valued Customer"}</div>
            <div class="address-text">
              ${order.shippingAddress?.addressLine || ""}<br />
              ${order.shippingAddress?.city ? `${order.shippingAddress.city}, ` : ""}${order.shippingAddress?.state || ""}
              <strong style="font-size: 13px; display: inline-block; margin-top: 2px;">PIN: ${order.shippingAddress?.pincode || ""}</strong><br />
              <strong>Phone: ${order.shippingAddress?.phone || ""}</strong>
            </div>
          </div>

          <!-- Items Manifest -->
          <div class="section">
            <div class="section-title">ORDER CONTENTS:</div>
            <table class="table">
              <thead>
                <tr style="border-bottom: 1px solid #000; font-size: 9px; text-transform: uppercase; color: #555;">
                  <th style="text-align: left; padding-bottom: 3px;">Item</th>
                  <th style="text-align: center; padding-bottom: 3px; width: 35px;">Qty</th>
                  <th style="text-align: right; padding-bottom: 3px; width: 55px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <!-- Sender & QR Code Footer -->
          <div class="footer">
            <div style="font-size: 10px; line-height: 1.35; max-width: 220px;">
              <div class="section-title">FROM (SENDER):</div>
              <strong>NEXT TASK Studio</strong><br />
              Personalized Handcrafted Stationery<br />
              Contact: contact@nexttask.in<br />
              <div style="font-size: 9px; color: #555; margin-top: 4px;">
                Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}<br />
                Amount Paid: <strong>Rs. ${order.totalAmount}</strong>
              </div>
            </div>

            <div class="qr-box">
              <img src="${qrDataUrl}" class="qr-img" alt="Order QR Manifest" />
              <div class="qr-caption">Scan for Details</div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-black/10 relative max-h-[92vh] flex flex-col">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-black uppercase tracking-wider">
                Shipping Label & QR Slip
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                Order #{order.orderNumber} • Compact 4x6&quot; / A6 Format
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Label Live Preview Box */}
        <div className="flex-1 overflow-y-auto py-4">
          <div
            ref={labelRef}
            className="bg-white border-2 border-black rounded-lg p-5 shadow-sm space-y-4 max-w-sm mx-auto text-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <div className="font-black text-base tracking-widest uppercase">
                  NEXT TASK
                </div>
                <div className="text-[9px] text-neutral-500 uppercase tracking-wider">
                  Handcrafted Stationery
                </div>
              </div>
              <div className="text-right">
                <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                  PREPAID
                </span>
                <div className="text-[10px] font-mono text-neutral-600 mt-1 font-bold">
                  #{order.orderNumber}
                </div>
              </div>
            </div>

            {/* Ship To Address */}
            <div className="border-b border-dashed border-neutral-300 pb-3 space-y-1">
              <div className="text-[9px] font-black uppercase tracking-wider text-neutral-500">
                SHIP TO (DELIVERY ADDRESS):
              </div>
              <div className="font-bold text-sm text-black">
                {order.shippingAddress?.fullName || "Valued Customer"}
              </div>
              <div className="text-xs text-neutral-700 leading-relaxed">
                {order.shippingAddress?.addressLine}
                <br />
                {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
                {order.shippingAddress?.state} -{" "}
                <strong className="text-black font-mono font-bold text-sm">
                  {order.shippingAddress?.pincode}
                </strong>
                <br />
                <span className="text-[11px] font-semibold text-neutral-600">
                  Phone: {order.shippingAddress?.phone}
                </span>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="border-b border-dashed border-neutral-300 pb-3 space-y-1.5">
              <div className="text-[9px] font-black uppercase tracking-wider text-neutral-500">
                ORDER CONTENTS:
              </div>
              <div className="space-y-1.5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start text-xs border-b border-neutral-100 pb-1"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-neutral-900 truncate">
                        {item.product.title}
                      </div>
                      {item.customText && (
                        <div className="mt-0.5 text-[10px] font-serif font-bold bg-black text-white px-1.5 py-0.5 rounded inline-block">
                          EMBOSS: &ldquo;{item.customText}&rdquo;
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0 font-mono text-[11px]">
                      x{item.quantity} • ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Return Address & QR Code */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[10px] text-neutral-600 space-y-0.5 max-w-[190px]">
                <div className="text-[8px] font-black uppercase tracking-wider text-neutral-400">
                  FROM (SENDER):
                </div>
                <div className="font-bold text-black">NEXT TASK Studio</div>
                <div>contact@nexttask.in</div>
                <div className="text-[9px] pt-1">
                  Total Paid: <strong className="text-black font-mono">₹{order.totalAmount}</strong>
                </div>
              </div>

              {/* High-Res QR Code Preview */}
              <div className="text-center shrink-0">
                {qrDataUrl ? (
                  <div className="border border-neutral-200 rounded p-1 bg-white inline-block shadow-2xs">
                    <img
                      src={qrDataUrl}
                      alt="Order QR Code"
                      className="w-20 h-20 object-contain mx-auto"
                    />
                    <div className="text-[8px] font-mono uppercase text-neutral-500 tracking-tighter mt-0.5">
                      Scan Details
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <QrIcon className="w-6 h-6 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready for thermal or compact inkjet label printers</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
