"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import veg from "../../public/veg.png";
import nonveg from "../../public/non-veg.png";
import dayjs from "dayjs";

function History() {
  const [userData, setUserData] = useState();
  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      getHistory(userData.user.id);
    }
  }, []);

  const getHistory = async (id) => {
    try {
      const res = await fetch("/api/getorderhistory", {
        method: "POST",
        body: JSON.stringify({ userId: id }),
      });
      const jres = await res.json();
      if (!jres.success) {
        throw jres.message;
      }
      setUserData(jres.data);
      console.log(jres.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] overflow-y-auto flex flex-col items-center p-10  ">
      <h1 className="mb-10 text-2xl font-bold">Your Orders</h1>
      <div className="flex flex-col gap-4">
        {userData?.map((order) => (
          <Card className="w-[300px] my-3">
            <CardHeader className="p-3">
              <CardTitle>Order ID</CardTitle>
              <CardDescription>{order.orderId}</CardDescription>
            </CardHeader>
            <CardContent>
              {order.items.map((item) => (
                <div className="flex gap-2 my-2">
                  {item.isVeg ? (
                    <Image src={veg} width={20} height={20} />
                  ) : (
                    <Image src={nonveg} width={20} height={20} />
                  )}
                  <span className="font-semibold text-gray-500">
                    {item.quantity} x
                  </span>{" "}
                  <span className="font-semibold">{item.name}</span>
                </div>
              ))}

              <hr className="mt-3" style={{ border: "1px dashed gray" }} />
              <div className="flex justify-between mt-5">
                <span className="font-semibold text-zinc-600">
                  {dayjs(order.createdAt).format("MMMM D, YYYY h:mm A")}
                </span>
                <span className="font-semibold">
                  ₹ {order.total + order.gst}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default History;
