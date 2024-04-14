import supabase from "../../supabaseClient";
import { NextResponse } from "next/server";

export async function PUT(req, res) {
  const updatedDish = await req.json();
  const { data, error } = await supabase
    .from("dishes")
    .update(updatedDish)
    .match({ _id: updatedDish._id });
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
    message: "Dish updated successfully",
    data: data,
    status: 200,
  });
}
