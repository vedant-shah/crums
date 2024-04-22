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
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("tableNumber", params.tableno)
    .eq("status", "In-progress");

  if (error) {
    return NextResponse.json({
      data: null,
      error: error.message,
      success: false,
      status: 500,
    });
  }

  let grandTotal = 0;
  let grandTotalGst = 0;
  const allItems = [];
  const allOrderIds = [];

  data.forEach((order) => {
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

  const result = {
    grandTotal,
    grandTotalGst,
    allItems: allItems,
    allOrderIds,
  };

  return NextResponse.json({
    data: result,
    message: "",
    success: true,
    status: 200,
  });
}
