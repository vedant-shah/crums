"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Input from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import supabase from "./supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import { FiClock } from "react-icons/fi";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function Orders() {
  var relativeTime = require("dayjs/plugin/relativeTime");
  dayjs.extend(relativeTime);
  const { toast } = useToast();

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
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
            }}
            className="rounded"
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 300,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        return <p>x{row.original.quantity}</p>;
      },
      size: 50,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        return <p>₹{row.original.price}</p>;
      },
      size: 50,
    },
    {
      header: "Total",
      cell: ({ row }) => {
        return (
          <p>₹{(row.original.price * row.original.quantity).toFixed(2)}</p>
        );
      },
      size: 50,
    },
  ];
  const [orders, setOrders] = useState();
  const [selectedOrder, setSelectedOrder] = useState();
  const [currentTab, setCurrentTab] = useState(1);
  const [loading, setLoading] = useState(false);

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
        console.log("payload:", payload.eventType);
        if (
          payload.eventType === "INSERT" ||
          payload.eventType === "UPDATE" ||
          payload.eventType === "DELETE"
        ) {
          getAllOrders();
        }
      }
    )
    .subscribe();

  useEffect(() => {
    getAllOrders();
  }, []);

  const setOrderCompleted = async () => {
    const confirmed = confirm(
      "Are you sure you want to mark this order as paid?"
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/markaspaid/${selectedOrder.orderId}`, {
        method: "POST",
      });
      const data = await response.json();
      if (!data.success) throw data.message;
      toast({
        title: "Success",
        description: data.message,
        variant: "success",
        duration: 1500,
      });
      setSelectedOrder(null);
      getAllOrders();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error,
        variant: "error",
        duration: 1500,
      });
    }
  };

  const getAllOrders = async () => {
    setLoading(true);
    // selectedOrder(null);
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      if (!data.success) throw data.message;
      setOrders(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmed = confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;
    try {
      const response = await fetch(
        `/api/admin/orders/${selectedOrder.orderId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!data.success) throw data.message;
      toast({
        title: "Success",
        description: data.message,
        variant: "success",
        duration: 1500,
      });
      setSelectedOrder(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error,
        variant: "error",
        duration: 1500,
      });
    }
  };

  const handleOrderConfirmed = async () => {
    const confirmed = confirm("Are you sure you want to confirm this order?");
    if (!confirmed) return;
    try {
      const response = await fetch(
        `/api/admin/orders/${selectedOrder.orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!data.success) throw data.message;
      toast({
        title: "Success",
        description: data.message,
        variant: "success",
        duration: 1500,
      });
      getAllOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error,
        variant: "error",
        duration: 1500,
      });
    }
  };

  return (
    <div className="flex w-[84vw] h-[100vh]">
      <div className="w-[30%] bg-zinc-900 flex flex-col items-center font-bold p-5">
        <h1 className="mb-4">Task List</h1>
        <Tabs defaultValue="new" className="flex flex-col w-full">
          <TabsList className="justify-between">
            <TabsTrigger
              onClick={() => {
                setCurrentTab(1);
                setSelectedOrder(null);
              }}
              value="new">
              <div className="flex items-center gap-1">
                New
                <Badge className="flex items-center justify-center w-4 h-4 ml-auto rounded-full shrink-0">
                  {orders?.liveOrders?.length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                setCurrentTab(2);
                setSelectedOrder(null);
              }}
              value="current">
              <div className="flex items-center gap-1">
                Ongoing
                <Badge className="flex items-center justify-center w-4 h-4 ml-auto rounded-full shrink-0">
                  {orders?.currentOrders?.length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                setCurrentTab(3);
                setSelectedOrder(null);
              }}
              value="Payment">
              <div className="flex items-center gap-1">
                Payment
                <Badge className="flex items-center justify-center w-4 h-4 ml-auto rounded-full shrink-0">
                  {orders?.readyToPayOrders?.length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                setCurrentTab(4);
                setSelectedOrder(null);
              }}
              value="Completed">
              <div className="flex items-center gap-1">
                Completed
                <Badge className="flex items-center justify-center w-4 h-4 ml-auto rounded-full shrink-0">
                  {orders?.completedOrders?.length}
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="new"
            style={{ height: "80vh", overflowY: "auto" }}>
            {loading ? (
              <>loading...</>
            ) : (
              orders?.liveOrders?.map((order) => (
                <div
                  key={order.orderId}
                  className={`w-full p-3 mb-2 rounded-lg ${order === selectedOrder ? "bg-zinc-700" : "bg-zinc-800 "}`}
                  onClick={() => setSelectedOrder(order)}
                  style={{ cursor: "pointer" }}>
                  <p className="text-sm font-normal">
                    <span className="font-bold">Table {order.tableNumber}</span>{" "}
                    - {dayjs(order.created_at).format("h:mm A, 	MMMM D ")}
                  </p>
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent value="current">
            {loading ? (
              <>loading...</>
            ) : (
              orders?.currentOrders?.map((order) => (
                <div
                  key={order.orderId}
                  className={`w-full p-3 mb-2 rounded-lg ${order === selectedOrder ? "bg-zinc-700" : "bg-zinc-800 "}`}
                  onClick={() => setSelectedOrder(order)}
                  style={{ cursor: "pointer" }}>
                  <p className="text-sm font-normal">
                    <span className="font-bold">Table {order.tableNumber}</span>{" "}
                    - {dayjs(order.created_at).format("h:mm A, 	MMMM D ")}
                  </p>
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent value="Payment">
            {loading ? (
              <>loading...</>
            ) : (
              orders?.readyToPayOrders?.map((order) => (
                <div
                  key={order.orderId}
                  className={`w-full p-3 mb-2 rounded-lg ${order === selectedOrder ? "bg-zinc-700" : "bg-zinc-800 "}`}
                  onClick={() => setSelectedOrder(order)}
                  style={{ cursor: "pointer" }}>
                  <p className="text-sm font-normal">
                    <span className="font-bold">Table {order.tableNumber}</span>{" "}
                    - {dayjs(order.created_at).format("h:mm A, 	MMMM D ")}
                  </p>
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent value="Completed">
            {loading ? (
              <>loading...</>
            ) : (
              orders?.completedOrders?.map((order) => (
                <div
                  key={order.orderId}
                  className={`w-full p-3 mb-2 rounded-lg ${order === selectedOrder ? "bg-zinc-700" : "bg-zinc-800 "}`}
                  onClick={() => setSelectedOrder(order)}
                  style={{ cursor: "pointer" }}>
                  <p className="text-sm font-normal">
                    <span className="font-bold">Table {order.tableNumber}</span>{" "}
                    - {dayjs(order.created_at).format("h:mm A, 	MMMM D ")}
                  </p>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-[70%]">
        <div className="flex  h-[100vh] flex-col items-center w-full p-5 font-bold bg-zinc-800">
          <h1 className="mb-4">
            {selectedOrder
              ? "Table Number: " + selectedOrder.tableNumber
              : "Task Details"}
          </h1>
          <div className="w-full h-[90vh] bg-black rounded-lg p-4">
            {!selectedOrder ? (
              <h1>Select an order from the sidebar to continue!</h1>
            ) : (
              <div className="flex flex-col overflow-y-hidden h-[100%] parent-container">
                <div className="flex flex-col top" style={{ flex: "0 0 auto" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h1>
                      <span className="underline">Order ID:</span>
                      {" " + selectedOrder.orderId}
                    </h1>
                    <h1 className="flex items-center gap-2">
                      <FiClock /> {dayjs(selectedOrder.created_at).fromNow()}
                    </h1>
                  </div>
                  {/* {currentTab === 1 && (
                    <div className="flex justify-end">
                      <Button
                        variant="secondary"
                        onClick={() => setOpenEditDialogue(true)}>
                        Edit Order
                      </Button>
                    </div>
                  )} */}
                  {selectedOrder.specialInstructions && (
                    <div className="my-8">
                      <h1>Special Instructions</h1>
                      <p className="text-gray-400">
                        {selectedOrder.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex-auto overflow-y-auto middle">
                  <DataTable
                    data={selectedOrder?.items}
                    columns={columns}
                    disablePagination={true}
                  />
                </div>
                <div
                  className="flex flex-col bottom"
                  style={{ flex: "0 0 auto" }}>
                  <div className="flex items-center justify-between px-3 mt-8">
                    <h1>Item Total</h1>
                    <h1>₹{selectedOrder.total.toFixed(2)}</h1>
                  </div>
                  <div className="flex items-center justify-between px-3 mb-3">
                    <h1>GST</h1>
                    <h1>₹{selectedOrder.gst.toFixed(2)}</h1>
                  </div>

                  <hr />

                  <div className="flex items-center justify-between px-3 mt-3">
                    <h1 className="text-2xl">Grand Total</h1>
                    <h1 className="text-2xl">
                      ₹{(selectedOrder.total + selectedOrder.gst).toFixed(2)}
                    </h1>
                  </div>

                  {currentTab === 1 && (
                    <div className="flex justify-between m-4">
                      <Button variant="destructive" onClick={handleCancelOrder}>
                        Cancel Order
                      </Button>
                      <Button onClick={handleOrderConfirmed}>
                        Confirm Order
                      </Button>
                    </div>
                  )}
                  {currentTab === 3 && (
                    <div className="flex justify-end m-4">
                      <Button variant="" onClick={setOrderCompleted}>
                        Mark As Paid
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
