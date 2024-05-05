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

  //group all the orders that are ready to pay by their table number
  let readyToPayOrders = orders.filter(
    (order) => order.status === "Ready to pay"
  );

  const groupedOrders = {};
  for (const order of readyToPayOrders) {
    const { tableNumber, total, gst, items } = order;
    if (!groupedOrders[tableNumber]) {
      groupedOrders[tableNumber] = {
        total: 0,
        gst: 0,
        items: [],
        tableNumber,
        orderIds: [],
      };
    }
    groupedOrders[tableNumber].orderIds.push(order.orderId);
    groupedOrders[tableNumber].total += total;
    groupedOrders[tableNumber].gst += gst;
    groupedOrders[tableNumber].items.push(...items);
  }
  let groupedByTableOrders = Object.values(groupedOrders);

  // let readyToPayOrders = orders.filter(
  //   (order) => order.status === "Ready to pay"
  // );

  return NextResponse.json({
    success: true,
    data: {
      liveOrders: orders.filter((order) => order.status === "Pending"),
      completedOrders: orders.filter((order) => order.status === "Completed"),
      readyToPayOrders: groupedByTableOrders,
      currentOrders: orders.filter((order) => order.status === "In-progress"),
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
