"use client";
import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import MenuItem from "@/components/MenuItem";
import SkeletonMenuItem from "@/components/SkeletonMenuItem";

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
        {allDishes.length > 0 ? (
          allDishes.map((dish) => {
            return <MenuItem dish={dish} />;
          })
        ) : (
          <>
            <SkeletonMenuItem />
            <SkeletonMenuItem />
            <SkeletonMenuItem />
          </>
        )}
      </div>
    </>
  );
}

export default TableOrder;
