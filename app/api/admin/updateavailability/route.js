import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";

export async function POST(req, res) {
  const { id, updatedValue } = await req.json();

  const { error } = await supabase
    .from("dishes")
    .update({ available: updatedValue })
    .eq("_id", id);

  if (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
  return NextResponse.json({
    success: true,
    data: [],
    message: "Availability updated successfully",
  });
}
