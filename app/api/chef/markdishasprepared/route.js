import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";

export async function POST(req, res) {
  const dish = await req.json();

  const { data, error } = await supabase
    .from("order_queue")
    .delete()
    .eq("_id", dish._id);

  if (error) {
    return NextResponse.json({
      status: 500,
      data: [],
      message: error.message,
      success: false,
    });
  }

  const { data: orderDetails, error: orderDetailsError } = await supabase
    .from("orders")
    .select("*")
    .eq("orderId", dish.orderid);

  let updatedItems = orderDetails[0].items;
  updatedItems.forEach((item) => {
    console.log("item:", item);
    console.log("dish:", dish);
    if (item.id === dish.item.id) {
      item.status = "Prepared";
      console.log("item:", item);
    }
  });

  //   console.log("updatedItems:", updatedItems);
  const { data: updatedOrder, error: updatedOrderError } = await supabase
    .from("orders")
    .update({ items: updatedItems })
    .eq("orderId", dish.orderid);

  if (updatedOrderError) {
    return NextResponse.json({
      status: 500,
      data: [],
      message: updatedOrderError.message,
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
    data: [],
    message: "Dish marked as prepared",
    status: 200,
  });
}
