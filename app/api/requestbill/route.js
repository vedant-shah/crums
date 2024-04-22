import { NextResponse } from "next/server";
import supabase from "../supabaseClient";

export async function POST(req) {
  const { tableNumber } = await req.json();
  if (!tableNumber) {
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
    .update({ status: "Ready to pay" })
    .eq("tableNumber", tableNumber)
    .eq("status", "In-progress");

  if (error) {
    return NextResponse.json({
      data: null,
      error: error.message,
      success: false,
      status: 500,
    });
  }

  return NextResponse.json({
    data: data,
    message: "Orders are ready to pay",
    success: true,
    status: 200,
  });
}
