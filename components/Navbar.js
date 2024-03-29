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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

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
  const [openLoginDialogue, setOpenLoginDialogue] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpPage, setOtpPage] = useState("send");
  const [otp, setOtp] = useState("");
  const Chance = require("chance");
  const chance = Chance();

  useEffect(() => {
    setCartCount(totalItems);
  }, [items]);

  useEffect(() => {
    const courseOrder = { starter: 0, main: 1, deserts: 2 };
    let temp = items;
    temp.sort((a, b) => courseOrder[a.course] - courseOrder[b.course]);
    setItems(temp);
  }, []);

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
      toast({
        title: "Success",
        description: "OTP Sent successfully",
        duration: 2500,
        variant: "success",
      });
      setOtpPage("verify");
    } catch (error) {
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
      localStorage.setItem("userData", JSON.stringify(data.data));
      toast({
        title: "Success",
        description: "You have been successfully logged in",
        duration: 2500,
        variant: "success",
      });
      setOpenLoginDialogue(false);
      placeOrder();
    } catch (error) {
      console.log("error:", typeof error);
      toast({
        title: "Error",
        description: error,
        duration: 2500,
        variant: "destructive",
      });
    }
  };
  const placeOrder = async () => {
    if (!localStorage.getItem("userData")) {
      setOpenLoginDialogue(true);
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
        toast({
          title: "Success",
          description: "Order was successfully placed.",
          duration: 2500,
          variant: "success",
        });
        emptyCart();
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: error,
          duration: 2500,
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="w-100 h-[10vh] flex items-center sticky p-4 justify-between top-0 z-[49] bg-[#090909]">
      <Button variant="secondary">
        <FileTextIcon className="w-4 h-4 mr-2" />
        Bill
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <div className="relative cart-button me-2" current-count={cartCount}>
            <Button>
              <LuShoppingCart className="w-4 h-4 mr-2" />
              Cart
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="flex flex-col">
          <SheetHeader
            className="h-[10vh] text-start"
            style={{ flex: "0 0 auto" }}>
            <SheetTitle className="mb-3 text-3xl">Your Order</SheetTitle>
            {localStorage.getItem("userData") && (
              <>
                Not +
                {`${JSON.parse(localStorage.getItem("userData")).user.phone}`.substring(
                  0,
                  2
                )}{" "}
                {`${JSON.parse(localStorage.getItem("userData")).user.phone}`.substring(
                  2
                )}{" "}
                ?
                <span>
                  <span
                    className="text-blue-500 underline"
                    onClick={() => {
                      localStorage.removeItem("userData");
                      setOpenLoginDialogue(true);
                    }}>
                    Click here
                  </span>{" "}
                  to change phone number
                </span>
              </>
            )}
          </SheetHeader>
          <ScrollArea className="" style={{ flex: "1 1 auto" }}>
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
                          <img
                            src="https://img.icons8.com/color/480/vegetarian-food-symbol.png"
                            style={{ width: "15px", height: "15px" }}
                            className="inline-flex me-3"
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
                        style={{ borderRadius: "5px 0 0 5px" }}>
                        -
                      </Badge>
                      <Badge variant="secondary" style={{ borderRadius: "0" }}>
                        {dish.quantity.toString().padStart(2, "0")}
                      </Badge>
                      <Badge
                        onClick={() => {
                          updateItemQuantity(dish.id, dish.quantity + 1);
                        }}
                        style={{ borderRadius: "0 5px  5px 0" }}>
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
            style={{ flex: "0 0 auto" }}>
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
            <Button disabled={items.length === 0} onClick={placeOrder}>
              Order
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={openLoginDialogue} onOpenChange={setOpenLoginDialogue}>
        <DialogContent className="flex flex-col items-center justify-center">
          <DialogHeader className="flex flex-col items-center justify-center">
            <DialogTitle>Hey, You'll have to Login to Continue</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex flex-col my-3 space-y-5 w-[70%]">
            {otpPage === "send" ? (
              <div className="flex flex-col space-y-7">
                <h1 className="font-bold">Enter your Phone:</h1>
                <div className="flex space-x-2">
                  <Button className="w-10 h-10 font-bold rounded-none">
                    +91
                  </Button>
                  <Input
                    type="number"
                    value={phone}
                    className="w-full h-10"
                    placeholder="Enter your 10 digit phone number"
                    onChange={(e) => {
                      if (e.target.value.toString().length <= 10) {
                        setPhone(e.target.value);
                      }
                    }}
                  />
                </div>
                <Button disabled={phone.length !== 10} onClick={sendOTP}>
                  Send Otp
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-5">
                <h1 className="font-bold">Verify OTP</h1>
                <h1>
                  Not {phone} ?{" "}
                  <span
                    className="text-blue-500 underline"
                    onClick={() => setOtpPage("send")}>
                    Click here
                  </span>{" "}
                  to change Phone number
                </h1>
                <Input
                  type="number"
                  value={otp}
                  className="w-full h-10"
                  placeholder="Enter your 6 digit OTP"
                  onChange={(e) => {
                    if (e.target.value.toString().length <= 6) {
                      setOtp(e.target.value);
                    }
                  }}
                />
                <Button disabled={otp.length !== 6} onClick={verifyOTP}>
                  Verify Otp
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Navbar;
