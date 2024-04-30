import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";

export async function GET(req, { params }) {
  const { tableno } = params;
  if (!tableno) {
    return NextResponse.json({
      data: {
        grandTotal: 0,
        grandTotalGst: 0,
        allItems: [],
        allOrderIds: [],
      },
      message: "No orders found",
      success: true,
      status: 200,
    });
  }
  const { data: inProgressData, error: inProgressErrors } = await supabase
    .from("orders")
    .select("*")
    .eq("tableNumber", params.tableno)
    .eq("status", "In-progress");

  if (inProgressErrors) {
    return NextResponse.json({
      data: null,
      error: inProgressErrors.message,
      success: false,
      status: 500,
    });
  }

  const { data: requestedBillData, error: requestedBillErrors } = await supabase
    .from("orders")
    .select("*")
    .eq("tableNumber", params.tableno)
    .eq("status", "Ready to pay");

  if (requestedBillErrors) {
    return NextResponse.json({
      data: null,
      error: requestedBillErrors.message,
      success: false,
      status: 500,
    });
  }

  let requestedBill = 0;
  let grandTotal = 0;
  let grandTotalGst = 0;
  const allItems = [];
  const allOrderIds = [];

  inProgressData.forEach((order) => {
    grandTotal += order.total;
    grandTotalGst += order.gst;
    order.items.forEach((item) => {
      allOrderIds.push(order.orderId);
      const existingItem = allItems.find((i) => i.name === item.name);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.itemTotal += item.itemTotal;
      } else {
        allItems.push(item);
      }
    });
    // allItems.push(order);
  });
  console.log(
    "🚀 ~ requestedBillData.forEach ~ requestedBillData:",
    requestedBillData
  );

  requestedBillData.forEach((order) => {
    requestedBill += order.total + order.gst;
  });

  const result = {
    grandTotal,
    grandTotalGst,
    allItems: allItems,
    allOrderIds,
    pendingPayment: requestedBill.toFixed(2),
  };

  return NextResponse.json({
    data: result,
    message: "",
    success: true,
    status: 200,
  });
}
