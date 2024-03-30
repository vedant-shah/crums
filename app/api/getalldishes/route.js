import supabase from "../supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const { data, error } = await supabase.from("dishes").select();
  //
  data.sort((a, b) => {
    const courseOrder = { starter: 0, main: 1, deserts: 2 };
    return courseOrder[a.course] - courseOrder[b.course];
  });

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
