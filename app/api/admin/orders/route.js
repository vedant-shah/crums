import supabase from "../../supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  //get current month orders only
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .gte("created_at", getMonthStart());

  if (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      liveOrders: orders.filter((order) => order.status === "Pending"),
      completedOrders: orders.filter((order) => order.status === "Completed"),
      reqPaymentOrders: orders.filter((order) => order.status === "ReqPayment"),
      currentOrders: orders.filter((order) => order.status === "Current"),
    },
    message: "Orders fetched successfully",
  });
}

function getMonthStart() {
  const today = new Date();
  today.setDate(1);
  today.setHours(0, 0, 0, 0);

  return today.toISOString();
}
