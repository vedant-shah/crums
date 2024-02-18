import { NextResponse } from "next/server";
import supabase from "../supabaseClient";
export async function POST(req, res) {
  const data1 = await req.json();
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
  } = data1;
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
    return NextResponse.json({ data1, error, status: 500 });
  }
  return NextResponse.json({ data1, status: 200 });
}
