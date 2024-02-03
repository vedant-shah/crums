import supabase from "../supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const { data, error } = await supabase.from("dishes").select();
  if (error) {
    return NextResponse.json(
      { error: "Internal Server Error. Something Went Wrong" },
      { status: 500 }
    );
  }
  return NextResponse.json({ data });
}
