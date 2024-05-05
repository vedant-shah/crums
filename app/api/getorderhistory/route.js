import { NextResponse } from "next/server";
import supabase from "../supabaseClient";

export async function POST(req, res) {
  const { userId } = await req.json();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("userId", userId)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
      data: null,
      status: 500,
    });
  }

  return NextResponse.json({
    success: true,
    message: "Orders fetched successfully",
    data,
    status: 200,
  });
}
