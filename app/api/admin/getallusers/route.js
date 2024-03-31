import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";

export async function GET(req, res) {
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  console.log("data:", users);
  if (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
  return NextResponse.json({
    success: true,
    data: users,
    message: "Users fetched successfully",
  });
}
