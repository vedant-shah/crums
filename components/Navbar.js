"use client";
import React from "react";
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

function Navbar() {
  const { isEmpty, totalItems, items, updateItemQuantity, removeItem } =
    useCart();

  return (
    <div className="w-100 h-[10vh] flex items-center p-4 justify-between">
      <Button variant="secondary">
        <FileTextIcon className="w-4 h-4 mr-2" />
        Bill
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <div
            className="relative cart-button"
            current-count={totalItems.toString()}>
            <Button>
              <LuShoppingCart className="w-4 h-4 mr-2" />
              Cart
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="h-[10vh]">
            <SheetTitle>Your Order</SheetTitle>
          </SheetHeader>
          <div className="h-[75vh]"></div>
          <SheetFooter className="h-[10vh]">Hello</SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Navbar;
