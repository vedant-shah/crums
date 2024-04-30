"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "react-use-cart";
import { FileTextIcon } from "@radix-ui/react-icons";
import { LuShoppingCart } from "react-icons/lu";
import { TbFaceId } from "react-icons/tb";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import Loader from "./ui/Loader";
import supabase from "@/supabaseClient";

function Navbar() {
  const { toast } = useToast();
  const {
    cartTotal,
    totalItems,
    items,
    updateItemQuantity,
    setItems,
    emptyCart,
  } = useCart();
  const [cartCount, setCartCount] = useState();
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [openLoginDialogue, setOpenLoginDialogue] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpPage, setOtpPage] = useState("send");
  const [otp, setOtp] = useState("");
  const [runningOrders, setRunningOrders] = useState();
  const Chance = require("chance");
  const chance = Chance();

  useEffect(() => {
    setCartCount(totalItems);
  }, [items]);

  useEffect(() => {
    getRunningBill();
  }, []);

  useEffect(() => {
    const courseOrder = { starter: 0, main: 1, deserts: 2 };
    let temp = items;
    temp.sort((a, b) => courseOrder[a.course] - courseOrder[b.course]);
    setItems(temp);
  }, []);

  const realtime = supabase
    .channel("orders")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter:
          typeof window !== "undefined" && localStorage?.getItem("tableNo")
            ? `tableNumber=eq.${localStorage.getItem("tableNo")}`
            : undefined,
      },
      (payload) => {
        console.log("payload:", payload);
        if (
          payload.eventType === "INSERT" ||
          payload.eventType === "UPDATE" ||
          payload.eventType === "DELETE"
        ) {
          getRunningBill();
        }
      }
    )
    .subscribe();

  const requestBill = async () => {
    const confirm = window.confirm("Are you sure you want to request bill?");
    if (!confirm) return;

    try {
      setLoading(true);
      const response = await fetch("/api/requestbill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableNumber: parseInt(localStorage.getItem("tableNo"), 10),
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw data.message;
      }
      getRunningBill();
      setLoading(false);
      toast({
        title: "Success",
        description: "Bill Requested successfully",
        duration: 2500,
        variant: "success",
      });
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error,
        duration: 2500,
        variant: "destructive",
      });
    }
  };

  const getRunningBill = async () => {
    try {
      const tableNo = localStorage.getItem("tableNo");
      if (!tableNo) return;
      const response = await fetch(`/api/runningorders/${tableNo}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw data.message;
      }
      setRunningOrders(data.data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error,
        duration: 2500,
        variant: "destructive",
      });
    }
  };

  const getCurrentCustomizations = (dish) => {
    let cus = [];
    Object.keys(dish.chosenCustomization).forEach((cust) => {
      cus = cus.concat(dish.chosenCustomization[cust]);
    });
    let str = cus.toString().slice(0, 17) + "...";

    return str;
  };
  const sendOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!data.success) {
        throw data.message;
      }
      setLoading(false);
      toast({
        title: "Success",
        description: "OTP Sent successfully",
        duration: 2500,
        variant: "success",
      });
      setOtpPage("verify");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: error,
        duration: 2500,
        variant: "destructive",
      });
    }
  };
  const verifyOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (!data.success) {
        throw data.message;
      }
      setLoading(false);
      localStorage.setItem("userData", JSON.stringify(data.data));
      toast({
        title: "Success",
        description: "You have been successfully logged in",
        duration: 2500,
        variant: "success",
      });
      setOpenLoginDialogue(false);
      setOtpPage("send");
      // if (items.length > 0) placeOrder();
    } catch (error) {
      console.log("error:", typeof error);
      setLoading(false);
      toast({
        title: "Error",
        description: error,
        duration: 2500,
        variant: "destructive",
      });
    } finally {
      setOtp("");
    }
  };
  const placeOrder = async () => {
    confirm = window.confirm("Are you sure you want to place the order?");
    if (!confirm) return;
    if (!localStorage.getItem("userData")) {
      setOpenLoginDialogue(true);
      setOtpPage("send");
    } else {
      const order = {
        items: items,
        total: parseFloat(cartTotal.toFixed(2)),
        gst: parseFloat((cartTotal * 0.05).toFixed(2)),
        specialInstructions: specialInstructions, // Updated to use state variable
        tableNumber: parseInt(localStorage.getItem("tableNo"), 10), // Assuming table number is stored in localStorage and converting to integer
        orderId: chance.guid(),
        status: "Pending",
        created_at: new Date().toISOString(),
        userId: localStorage.getItem("userData")
          ? JSON.parse(localStorage.getItem("userData")).user.id
          : null, // Retrieve userId from local storage
      };
      setLoading(true);
      try {
        const response = await fetch("/api/placeOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        });
        const data = await response.json();
        if (!data.success) {
          throw data.message;
        }
        console.log("Order placed:", data);
        setLoading(false);
        toast({
          title: "Success",
          description: "Order was successfully placed.",
          duration: 2500,
          variant: "success",
        });
        getRunningBill();
        emptyCart();
        setSpecialInstructions("");
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: error,
          duration: 2500,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="w-100 h-[10vh] flex items-center sticky p-4 justify-between top-0 z-[49] bg-[#090909]">
      <Sheet>
        <SheetTrigger asChild>
          <div className="relative me-2">
            <Button variant="secondary">
              <FileTextIcon className="w-4 h-4 mr-2" />
              Bill: ₹{" "}
              {runningOrders?.grandTotal + runningOrders?.grandTotalGst || 0}
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent
          side="left"
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="flex flex-col"
        >
          <SheetHeader
            className="h-[15vh] flex flex-col justify-around"
            style={{ flex: "0 0 auto" }}
          >
            <SheetTitle className="mb-3 text-3xl">
              Your Current Orders
            </SheetTitle>

            <hr className="my-2" />
          </SheetHeader>
          <ScrollArea
            className="flex items-center justify-center"
            style={{ flex: "1 1 auto" }}
          >
            {runningOrders?.allItems?.length === 0 && (
              <>
                <div className="flex flex-col items-center justify-center h-full">
                  <TbFaceId className="w-16 h-16" />
                  <h1 className="mt-2 text-lg">
                    Oops! There's nothing here to see.
                  </h1>
                </div>
              </>
            )}
            {runningOrders?.allItems.map((dish) => {
              return (
                <>
                  <div className="flex justify-between mb-10">
                    <div className="w-[50%] flex">
                      <div className="h-[100%] flex items-center justify-center">
                        {dish.isVeg ? (
                          <Image
                            src="https://img.icons8.com/color/480/vegetarian-food-symbol.png"
                            style={{ width: "15px", height: "15px" }}
                            className="inline-flex me-3"
                            width={15}
                            height={15}
                            alt=""
                          />
                        ) : (
                          <Image
                            src="/non-veg.png"
                            style={{ width: "15px", height: "15px" }}
                            className="inline-flex me-3"
                            width={15}
                            height={15}
                            alt=""
                          />
                        )}
                      </div>
                      <div>
                        <h1 className="inline-flex ">{dish.name}</h1>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="secondary" style={{ borderRadius: "0" }}>
                        x{dish.quantity}
                      </Badge>
                    </div>
                    <h3 className="flex items-center">
                      ₹ {dish.itemTotal.toFixed(2)}
                    </h3>
                  </div>
                </>
              );
            })}
          </ScrollArea>
          <hr style={{ border: "1px dashed" }} />
          <div
            className="flex flex-col justify-end "
            style={{ flex: "0 0 auto" }}
          >
            <div className="flex flex-col">
              <h1 className="mb-2 font-bold">Bill Details</h1>
              <div className="flex justify-between ">
                <h1 className="text-lg ">Items Total</h1>
                <h1 className="text-lg ">
                  ₹ {runningOrders?.grandTotal.toFixed(2)}
                </h1>
              </div>
              <div className="flex justify-between mb-5">
                <h1 className="text-lg ">GST</h1>
                <h1 className="text-lg ">₹ {runningOrders?.grandTotalGst}</h1>
              </div>
            </div>
            <div className="flex justify-between mb-5">
              <h1 className="text-xl font-extrabold">TO PAY</h1>
              <h1 className="text-xl font-extrabold">
                ₹ {runningOrders?.grandTotal + runningOrders?.grandTotalGst}
              </h1>
            </div>
            <Button
              disabled={loading || runningOrders?.allItems.length === 0}
              onClick={requestBill}
              className="flex items-center"
            >
              {loading && <Loader className="w-5 h-5 " />}
              Request Bill
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <div className="relative cart-button me-2" current-count={cartCount}>
            <Button className="flex items-center">
              <LuShoppingCart className="w-4 h-4 mr-2" />
              Cart
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="flex flex-col"
        >
          <SheetHeader
            className="h-[15vh] flex flex-col justify-around"
            style={{ flex: "0 0 auto" }}
          >
            <SheetTitle className="mb-3 text-3xl">
              Table: {localStorage.getItem("tableNo")}
            </SheetTitle>
            {typeof localStorage !== "undefined" &&
            localStorage.getItem("userData") ? (
              <>
                Not +
                {`${JSON.parse(localStorage.getItem("userData"))?.user?.phone}`.substring(
                  0,
                  2
                )}{" "}
                {`${JSON.parse(localStorage.getItem("userData"))?.user?.phone}`.substring(
                  2
                )}{" "}
                ?
                <span>
                  <span
                    className="text-blue-500 underline"
                    onClick={() => {
                      localStorage.removeItem("userData");
                      setOtpPage("send");
                      setOpenLoginDialogue(true);
                    }}
                  >
                    Click here
                  </span>{" "}
                  to change phone number
                </span>
              </>
            ) : (
              <>
                <span
                  className="text-blue-500 underline"
                  onClick={() => {
                    setOpenLoginDialogue(true);
                    setOtpPage("send");
                  }}
                >
                  Login
                </span>{" "}
              </>
            )}
            <hr className="my-2" />
          </SheetHeader>
          <ScrollArea
            className="flex items-center justify-center"
            style={{ flex: "1 1 auto" }}
          >
            {items.length === 0 && (
              <>
                <div className="flex flex-col items-center justify-center h-full">
                  <TbFaceId className="w-16 h-16" />
                  <h1 className="mt-2 text-lg">
                    Let's add something to cart first, shall we?
                  </h1>
                </div>
              </>
            )}
            {items.map((dish) => {
              return (
                <>
                  <div className="flex justify-between mb-10">
                    <div className="w-[50%] flex">
                      <div className="h-[100%] flex items-start justify-center">
                        {dish.isVeg ? (
                          <Image
                            src="https://img.icons8.com/color/480/vegetarian-food-symbol.png"
                            style={{ width: "15px", height: "15px" }}
                            className="inline-flex me-3"
                            width={15}
                            height={15}
                            alt=""
                          />
                        ) : (
                          <Image
                            src="/non-veg.png"
                            style={{ width: "15px", height: "15px" }}
                            className="inline-flex me-3"
                            width={15}
                            height={15}
                            alt=""
                          />
                        )}
                      </div>
                      <div>
                        <h1 className="inline-flex mb-2">{dish.name}</h1>
                        <h1 className="text-xs text-gray-400">
                          {dish.availableCustomizations &&
                            getCurrentCustomizations(dish)}
                        </h1>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        onClick={() => {
                          updateItemQuantity(dish.id, dish.quantity - 1);
                        }}
                        style={{ borderRadius: "5px 0 0 5px" }}
                      >
                        -
                      </Badge>
                      <Badge variant="secondary" style={{ borderRadius: "0" }}>
                        {dish.quantity.toString().padStart(2, "0")}
                      </Badge>
                      <Badge
                        onClick={() => {
                          updateItemQuantity(dish.id, dish.quantity + 1);
                        }}
                        style={{ borderRadius: "0 5px  5px 0" }}
                      >
                        +
                      </Badge>
                    </div>
                    <h3 className="flex items-center">
                      ₹ {dish.price * dish.quantity}
                    </h3>
                  </div>
                </>
              );
            })}
          </ScrollArea>
          <div
            className="flex flex-col justify-end "
            style={{ flex: "0 0 auto" }}
          >
            <input type="text" autoFocus="true" className="hidden" />
            <Textarea
              className="my-3"
              placeholder="Any Special Instructions?"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
            <div className="flex flex-col">
              <h1 className="mb-2 font-bold">Bill Details</h1>
              <div className="flex justify-between ">
                <h1 className="text-lg ">Items Total</h1>
                <h1 className="text-lg ">₹ {cartTotal.toFixed(2)}</h1>
              </div>
              <div className="flex justify-between mb-5">
                <h1 className="text-lg ">GST</h1>
                <h1 className="text-lg ">₹ {(0.05 * cartTotal).toFixed(2)}</h1>
              </div>
            </div>
            <div className="flex justify-between mb-5">
              <h1 className="text-xl font-extrabold">TO PAY</h1>
              <h1 className="text-xl font-extrabold">
                ₹ {(cartTotal + 0.05 * cartTotal).toFixed(2)}
              </h1>
            </div>
            <Button
              disabled={items.length === 0}
              onClick={placeOrder}
              className="flex items-center"
            >
              {loading && <Loader className="w-5 h-5 " />}
              Order
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={openLoginDialogue} onOpenChange={setOpenLoginDialogue}>
        <DialogContent className="flex flex-col items-center justify-center">
          {/* <h2 className="w-[70%]">Hey, You'll have to Login to Continue</h2> */}
          <div className="flex flex-col my-3 space-y-5 w-[70%]">
            {otpPage === "send" ? (
              <div className="flex flex-col space-y-7">
                <h1 className="font-bold">Enter your Phone:</h1>
                <div className="flex items-center ">
                  <Button
                    className="w-10 h-10 font-bold"
                    style={{ borderRadius: "5px 0 0 5px" }}
                  >
                    +91
                  </Button>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={phone}
                    className="w-full h-11 ms-0"
                    placeholder="Enter your 10 digit phone number"
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>
                <Button
                  disabled={phone.length !== 10}
                  onClick={sendOTP}
                  className="flex items-center"
                >
                  {loading && <Loader className="w-5 h-5 " />}
                  Send Otp
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-5">
                <h1 className="font-bold">Verify OTP</h1>
                <h1>
                  Not {phone} ? <br />
                  <span
                    className="text-blue-500 underline"
                    onClick={() => setOtpPage("send")}
                  >
                    Click here
                  </span>{" "}
                  to change Phone number
                </h1>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  className="w-full"
                  onChange={(e) => {
                    setOtp(e);
                  }}
                  onComplete={() => {
                    verifyOTP();
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p>
                  Didn't receive OTP?{" "}
                  <span className="text-blue-500 underline" onClick={sendOTP}>
                    Resend
                  </span>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Navbar;
