"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FileTextIcon } from "@radix-ui/react-icons";
import { LuShoppingCart } from "react-icons/lu";
import { useCart } from "react-use-cart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

function Navbar() {
  const {
    cartTotal,
    totalItems,
    items,
    updateItemQuantity,
    removeItem,
    setItems,
  } = useCart();
  const [cartCount, setCartCount] = useState();
  const [cartItemsCopy, setCartItemsCopy] = useState(items);

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
          <SheetHeader className="h-[10vh]" style={{ flex: "0 0 auto" }}>
            <SheetTitle className="text-3xl">Your Order</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[65vh]" style={{ flex: "1 1 auto" }}>
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
                          updateItemQuantity(
                            items.filter((item) => item._id === dish._id)[0].id,
                            items.filter((item) => item._id === dish._id)[0]
                              .quantity - 1
                          );
                        }}
                        style={{ borderRadius: "5px 0 0 5px" }}>
                        -
                      </Badge>
                      <Badge variant="secondary" style={{ borderRadius: "0" }}>
                        {
                          items.filter((item) => item._id === dish._id)[0]
                            ?.quantity
                        }
                      </Badge>
                      <Badge
                        onClick={() => {
                          updateItemQuantity(
                            items.filter((item) => item._id === dish._id)[0].id,
                            items.filter((item) => item._id === dish._id)[0]
                              .quantity + 1
                          );
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
            />
            {/* <Separator className="my-3" /> */}
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
                ₹ {cartTotal + 0.05 * cartTotal}
              </h1>
            </div>
            <Button>Order</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Navbar;
