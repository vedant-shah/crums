import supabase from "../supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const { data, error } = await supabase.from("dishes").select();
  if (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
  return NextResponse.json({
    success: true,
    data,
    message: "Dishes fetched successfully",
  });
}
