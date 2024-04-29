import { NextResponse } from "next/server";
import supabase from "../../../supabaseClient";
import fs from "fs";

export async function PUT(req, { params }) {
  const { orderid } = params;

  try {
    const filePath = "./app/api/windowOrders.json";
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
    }
    const fileContents = fs.readFileSync(filePath, "utf8");
    const windowOrders = JSON.parse(fileContents || "[]");

    const { data, error } = await supabase
      .from("orders")
      .update({ status: "In-progress" })
      .eq("orderId", orderid)
      .select("*");
    console.log("data:", data);
    if (error) throw error;

    data[0].items.forEach((item) => {
      windowOrders.push({
        ...item,
        orderid,
        tableNumber: data[0].tableNumber,
        specialInstructions: data[0].specialInstructions,
      });
    });

    fs.writeFileSync(filePath, JSON.stringify(windowOrders, null, 2));

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
