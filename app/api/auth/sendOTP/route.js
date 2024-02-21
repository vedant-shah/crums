import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";

export async function POST(req) {
  const { phone } = await req.json();
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: "+91" + phone.toString(),
  });
  if (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
  return NextResponse.json({
    success: true,
    data,
    message: "OTP sent successfully",
  });
}
