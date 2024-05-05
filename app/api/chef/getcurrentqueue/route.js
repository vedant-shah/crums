import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";

export async function GET(req, res) {
  const { data: orders, error } = await supabase
    .from("order_queue")
    .select("*")
    .order("_id", { ascending: true });

  if (error) {
    return NextResponse.json({
      status: 500,
      data: [],
      message: error.message,
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
    data: orders,
    message: "Orders fetched successfully",
    status: 200,
  });
}
