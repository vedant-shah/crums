import { NextResponse } from "next/server";
import supabase from "../supabaseClient";
export async function POST(req, res) {
  const {
    items,
    total,
    gst,
    specialInstructions,
    tableNumber,
    orderId,
    status,
    created_at,
    userId,
  } = await req.json();
  const { data, error } = await supabase.from("orders").insert({
    items,
    total,
    gst,
    specialInstructions,
    tableNumber,
    orderId,
    status,
    created_at,
    userId,
  });

  if (error) {
    return NextResponse.json({
      success: false,
      error,
      message: error.message,
      status: 500,
    });
  }
  return NextResponse.json({
    success: true,
    data,
    message: "Order placed successfully",
    status: 200,
  });
}
