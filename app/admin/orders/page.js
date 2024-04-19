"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import supabase from "./supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import { FiClock } from "react-icons/fi";
import DataTable from "@/components/ui/data-table";

function Orders() {
  var relativeTime = require("dayjs/plugin/relativeTime");
  dayjs.extend(relativeTime);

  const columns = [
    {
      accessorKey: "imgUrl",
      header: "Image",
      size: 20,
      cell: ({ row }) => {
        return (
          <Image
            src={row.original.imgUrl}
            alt={row.original.name}
            width={50}
            height={50}
            className="rounded"
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        return <p>x{row.original.quantity}</p>;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        return <p>₹{row.original.price}</p>;
      },
    },
  ];
  const [orders, setOrders] = useState();
  const [selectedOrder, setSelectedOrder] = useState();
  const realtime = supabase
    .channel("orders")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        console.log("Change received!", payload);
      }
    )
    .subscribe();

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
            style={{ height: "80vh", overflowY: "auto" }}
          >
            {orders?.liveOrders?.map((order) => (
              <div
                key={order.id}
                className="w-full p-3 mb-2 rounded-lg bg-zinc-800"
                onClick={() => setSelectedOrder(order)}
                style={{ cursor: "pointer" }}
              >
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
          <h1 className="mb-4">
            {selectedOrder
              ? "Table Number: " + selectedOrder.tableNumber
              : "Task Details"}
          </h1>
          <div className="w-full h-[85vh] bg-black rounded-lg p-4">
            {!selectedOrder ? (
              <h1>Select an order from the sidebar to continue!</h1>
            ) : (
              <>
                {console.log(selectedOrder)}
                <div className="flex justify-between items-center mb-4">
                  <h1>Order ID: {selectedOrder.orderId}</h1>
                  <h1 className="flex items-center gap-2">
                    <FiClock /> {dayjs(selectedOrder.created_at).fromNow()}
                  </h1>
                </div>

                {selectedOrder.specialInstructions && (
                  <div className="my-8">
                    <h1>Special Instructions</h1>
                    <p className="text-gray-400">
                      {selectedOrder.specialInstructions}
                    </p>
                  </div>
                )}
                <DataTable
                  data={selectedOrder?.items}
                  columns={columns}
                  disablePagination={true}
                />
                <div className="flex justify-between items-center mt-8 px-3">
                  <h1>Item Total</h1>
                  <h1>₹{selectedOrder.total.toFixed(2)}</h1>
                </div>
                <div className="flex justify-between items-center mb-3 px-3">
                  <h1>GST</h1>
                  <h1>₹{selectedOrder.gst.toFixed(2)}</h1>
                </div>

                <hr />

                <div className="flex justify-end items-center mt-3 px-3">
                  <h1 className="text-2xl">
                    ₹{(selectedOrder.total + selectedOrder.gst).toFixed(2)}
                  </h1>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
