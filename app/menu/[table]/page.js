"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";

function TableOrder({ params }) {
  //constants
  const Cryptr = require("cryptr");
  const cryptr = new Cryptr("myTotallySecretKey");
  let decryptedTableNo;

  //states
  const [tableNo, setTableNo] = useState();
  const [allDishes, setAllDishes] = useState([]);
  //use-effects
  useEffect(() => {
    setTableNo(cryptr.decrypt(params.table));
    localStorage.setItem("tableNo", decryptedTableNo);
    getAllDishes();
  }, []);

  //functions
  const getAllDishes = async () => {
    const response = await fetch("/api/getalldishes");
    const data = await response.json();
    setAllDishes(data.data);
  };

  return (
    <>
      <div className="flex flex-col p-4 max-w-[768px]  mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-7 scroll-m-20 lg:text-5xl">
          Hey there!
        </h1>
        <Input className="mb-4" placeholder="Search" />
        {allDishes.length > 0 &&
          allDishes.map((dish) => {
            return (
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
                  <Button className="absolute right-[10%] bottom-[5px]">
                    Add
                  </Button>
                </div>
              </Card>
            );
          })}
      </div>
    </>
  );
}

export default TableOrder;
