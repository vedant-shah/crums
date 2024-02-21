import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";

export async function POST(req) {
  const { phone, otp } = await req.json();
  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    phone: "+91" + phone.toString(),
    token: otp.toString(),
    type: "sms",
  });

  if (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
  return NextResponse.json({
    success: true,
    data: session,
    message: "OTP verified successfully",
  });
}
