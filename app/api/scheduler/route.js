import fs from "fs";
import { NextResponse } from "next/server";
import supabase from "../supabaseClient";

export async function GET(req, res) {
  console.log(__dirname);
  const fileContents = fs.readFileSync("./app/api/windowOrders.json", "utf8");
  let windowOrders = JSON.parse(fileContents);
  if (windowOrders.length === 0) {
    return;
  }

  const eqSet = (as, bs) => {
    if (as.size !== bs.size) {
      return false;
    }
    for (const a of as) {
      if (!bs.has(a)) {
        return false;
      }
    }
    return true;
  };

  let table = new Set();
  let orders_copy = [...windowOrders];
  let lru_table_orders = new Set();
  let sorted_orders = [];
  let courseOrder = { starter: 1, main: 2, dessert: 3 };
  //loop through the orders and get the table numbers
  windowOrders.forEach((order) => {
    table.add(order.tableNumber);
  });
  for (let i = 1; i <= table.size; i++) {
    let minCookingItem = orders_copy.reduce((prev, current) => {
      if (courseOrder[prev.item.course] < courseOrder[current.item.course]) {
        return prev;
      } else if (
        courseOrder[prev.item.course] > courseOrder[current.item.course]
      ) {
        return current;
      } else {
        // if course types are equal, return the order with the lower cooking time
        return prev.item.cookTime < current.item.cookTime ? prev : current;
      }
    });

    windowOrders = windowOrders.filter((order) => {
      return order.item.id !== minCookingItem.item.id;
    });

    sorted_orders.push(minCookingItem);
    lru_table_orders.add(minCookingItem.tableNumber);
    orders_copy = orders_copy.filter((order) => {
      return order.tableNumber !== minCookingItem.tableNumber;
    });
    if (orders_copy.length === 0) {
      break;
    }
  }

  orders_copy = [...windowOrders];
  let serviced_tables = new Set();
  while (!eqSet(serviced_tables, lru_table_orders)) {
    lru_table_orders.forEach((table) => {
      orders_copy = windowOrders.filter((order) => {
        return order.tableNumber === table;
      });

      if (orders_copy.length !== 0) {
        let minCookingItem = orders_copy.reduce((prev, current) => {
          if (
            courseOrder[prev.item.course] < courseOrder[current.item.course]
          ) {
            return prev;
          } else if (
            courseOrder[prev.item.course] > courseOrder[current.item.course]
          ) {
            return current;
          } else {
            // if course types are equal, return the order with the lower cooking time
            return prev.item.cookTime < current.item.cookTime ? prev : current;
          }
        });
        windowOrders = windowOrders.filter((order) => {
          return order.item.id !== minCookingItem.item.id;
        });
        sorted_orders.push(minCookingItem);
      } else serviced_tables.add(table);
    });
  }
  // fs.writeFileSync(filePath, "[]");
  const { data, error } = await supabase
    .from("order_queue")
    .insert(sorted_orders);

  if (error) {
    return NextResponse.json({
      message: error.message,
      success: false,
      status: 500,
      data: [],
    });
  }

  return NextResponse.json({
    success: true,
    data: sorted_orders,
    message: "Orders fetched successfully",
    status: 200,
  });
}
