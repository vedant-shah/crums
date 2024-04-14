"use client";
import React, { useState, useEffect } from "react";
import supabase from "./supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
function Orders() {
  const [orders, setOrders] = useState();
  const [selectedOrder, setSelectedOrder] = useState();
  // const realtime = supabase
  //   .channel("orders")
  //   .on(
  //     "postgres_changes",
  //     {
  //       event: "*",
  //       schema: "public",
  //       table: "orders",
  //     },
  //     (payload) => {
  //       console.log("Change received!", payload);
  //     }
  //   )
  //   .subscribe();

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      if (!data.success) throw data.message;
      setOrders(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex w-[83vw] h-[95vh]">
      <div className="w-[30%] bg-zinc-900 flex flex-col items-center font-bold p-5">
        <h1 className="mb-4">Task List</h1>
        <Tabs defaultValue="new" className="flex flex-col w-full">
          <TabsList className="w-full">
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="Payment">Payment</TabsTrigger>
            <TabsTrigger value="Completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent
            value="new"
            style={{ height: "80vh", overflowY: "auto" }}>
            {orders?.liveOrders?.map((order) => (
              <div
                key={order.id}
                className="w-full p-3 mb-2 rounded-lg bg-zinc-800">
                <p className="text-sm font-normal">
                  <span className="font-bold">Table {order.tableNumber}</span> -{" "}
                  {dayjs(order.created_at).format("h:mm A, 	MMMM D ")}
                </p>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="current">Change your password here.</TabsContent>
          <TabsContent value="Payment">Change your password here.</TabsContent>
          <TabsContent value="Completed">
            Change your password here.
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-[70%]">
        <div className="flex flex-col items-center w-full p-5 font-bold bg-zinc-800">
          <h1 className="mb-4">Task Details</h1>
          <div className="w-full h-[85vh] bg-zinc-700 rounded-lg p-4">
            {!selectedOrder ? (
              <h1>Select an order from the sidebar to continue!</h1>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
