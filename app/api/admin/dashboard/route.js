import { NextResponse } from "next/server";
import supabase from "../../supabaseClient";

export async function GET(req, res) {
  const response = {};

  const { data, error } = await supabase
    .from("orders")
    .select()
    .eq("status", "Completed")
    .gte("created_at", getYearStart());

  // group the orders by month and store them in an object
  let groupedOrders = data.reduce((acc, curr) => {
    const month = new Date(curr.created_at).getMonth();
    acc[month] = acc[month] || {
      month: getMonthName(month),
      noOfOrders: 0,
      revenue: 0,
    };
    acc[month].noOfOrders++;
    acc[month].revenue += curr.total + curr.gst;
    return acc;
  }, {});

  groupedOrders = Object.values(groupedOrders);

  response.monthlyData = groupedOrders;

  response.monthlyRevenue = groupedOrders[groupedOrders.length - 1].revenue;

  const latestMonth = new Date().getMonth();

  const latestMonthOrders = data.filter(
    (order) => new Date(order.created_at).getMonth() === latestMonth
  );

  response.recentOrders = latestMonthOrders.slice(0, 5);

  const items = latestMonthOrders.reduce((acc, curr) => {
    curr.items.forEach((item) => {
      acc[item.name] = acc[item.name] || 0;
      acc[item.name] += item.quantity;
    });
    return acc;
  }, {});

  const mostFrequentItem = Object.entries(items).reduce((acc, curr) => {
    return curr[1] > acc[1] ? curr : acc;
  });

  response.mostFrequentItem = mostFrequentItem;

  if (error) {
    console.error(error);
    return NextResponse.json({
      message: "An error occurred while fetching data",
      success: false,
      data: [],
      status: 500,
    });
  }

  return NextResponse.json({
    message: "Analytics data fetched successfully",
    success: true,
    data: response,
    status: 200,
  });
}

function getMonthName(month) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
}

function getYearStart() {
  const today = new Date();
  today.setMonth(0, 1); // Set date to the 1st of January
  today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

  return today.toISOString();
}
