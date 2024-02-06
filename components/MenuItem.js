"use client";
import React, { useState, useEffect } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useCart } from "react-use-cart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";

function MenuItem({ dish }) {
  const Chance = require("chance");
  const chance = Chance();
  const { addItem, items, updateItemQuantity, getItem } = useCart();

  const addItemToCart = () => {
    dish.id = chance.guid();
    addItem(dish);
  };

  return (
    <>
      <Card className="flex p-2 my-3 max-w-[768px] lg-min-w-[768px]">
        <div className="w-[70%] ps-1 py-2 pe-4">
          <CardTitle className="mb-2">
            {dish.isVeg ? (
              <img
                src="https://img.icons8.com/color/480/vegetarian-food-symbol.png"
                style={{ width: "15px", height: "15px" }}
                className="mb-2 me-3"
                alt=""
              />
            ) : (
              <Image
                src="/non-veg.png"
                style={{ width: "15px", height: "15px" }}
                className="mb-2 me-3"
                width={15}
                height={15}
                alt=""
              />
            )}
            {dish.name}
          </CardTitle>
          <CardDescription>₹ {dish.price}</CardDescription>
          <CardDescription className="mt-3 text-start">
            {dish.description}
          </CardDescription>
        </div>
        <div className="w-[30%] flex justify-end items-center relative">
          <Image
            src={dish.imgUrl}
            width={100}
            height={100}
            className="object-cover rounded h-[100px] w-[100px]"
            alt="image"
          />
          {!dish.availableCustomizations &&
            items.filter((item) => item._id === dish._id).length === 0 && (
              <Button
                onClick={addItemToCart}
                className="absolute right-[15%] bottom-[5px]">
                Add
              </Button>
            )}
          {!dish.availableCustomizations &&
            items.filter((item) => item._id === dish._id).length > 0 && (
              <div className="absolute right-[5%] bottom-[5px]">
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
                  {items.filter((item) => item._id === dish._id)[0]?.quantity}
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
            )}
        </div>
      </Card>
    </>
  );
}

export default MenuItem;
