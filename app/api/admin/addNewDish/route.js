import supabase from "../../supabaseClient";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  const {
    name,
    description,
    course,
    cuisine,
    imgUrl,
    calories,
    price,
    available,
    isVeg,
    cookTime,
  } = await req.json();
  console.log(name);
  const { data, error } = await supabase.from("dishes").insert([
    {
      name,
      description,
      course,
      cuisine,
      calories,
      price,
      available,
      isVeg,
      imgUrl,
      cookTime,
    },
  ]);
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
    message: "Dish added successfully",
    data: data,
    status: 200,
  });
}
