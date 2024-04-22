import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";

export async function POST(req, { params }) {
  const { orderId } = params;
  if (!orderId) {
    return NextResponse.json({
      data: [],
      message: "No orders found",
      success: false,
      status: 200,
    });
  }
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "Completed" })
    .eq("orderId", orderId);

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
