import { NextResponse } from "next/server";
import supabase from "../../../supabaseClient";

export async function PUT(req, { params }) {
  const { orderid } = params;

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "In-progress" })
      .eq("orderId", orderid);

    if (error) throw error;

    return NextResponse.json({
      data: [],
      success: true,
      message: "Order confirmed successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: [],
      success: false,
      message: error.message,
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { orderid } = params;

  try {
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("orderId", orderid);

    if (error) throw error;

    return NextResponse.json({
      data: [],
      success: true,
      message: "Order deleted successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: [],
      success: false,
      message: error.message,
      status: 500,
    });
  }
}
