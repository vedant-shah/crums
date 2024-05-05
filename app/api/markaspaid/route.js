import { NextResponse } from "next/server";
import supabase from "../supabaseClient";

export async function POST(req, { params }) {
  const orderIds = await req.json();
  if (orderIds.length === 0) {
    return NextResponse.json({
      data: [],
      message: "No orders found",
      success: false,
      status: 200,
    });
  }

  orderIds.forEach(async (order) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "Completed" })
      .eq("orderId", order);

    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        success: false,
        status: 500,
      });
    }
  });

  return NextResponse.json({
    data: [],
    message: "Orders are ready to pay",
    success: true,
    status: 200,
  });
}
