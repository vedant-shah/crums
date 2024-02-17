"use client";
import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import MenuItem from "@/components/MenuItem";
import SkeletonMenuItem from "@/components/SkeletonMenuItem";
import { Label } from "@/components/ui/label";
import { TbFaceIdError } from "react-icons/tb";
function TableOrder({ params }) {
  //constants
  const Cryptr = require("cryptr");
  const cryptr = new Cryptr("myTotallySecretKey");
  let decryptedTableNo;
  const [searchValue, setSearchValue] = useState("");

  //states
  const [tableNo, setTableNo] = useState();
  const [allDishes, setAllDishes] = useState([]);
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  //use-effects
  useEffect(() => {
    setTableNo(cryptr.decrypt(params.table));
    localStorage.setItem("tableNo", decryptedTableNo);
    setLoading(true);
    getAllDishes();
  }, []);

  //functions
  const getAllDishes = async () => {
    const response = await fetch("/api/getalldishes");
    const data = await response.json();
    setAllDishes(data.data);
    setLoading(false);
  };

  const filteredDishes = allDishes.filter((val) => {
    if (vegOnly) {
      if (searchValue === "" && val.isVeg) return val;
      else if (
        val.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        val.isVeg
      )
        return val;
    } else {
      if (searchValue === "") return val;
      else if (val.name.toLowerCase().includes(searchValue.toLowerCase()))
        return val;
    }
  });

  const dishItems = filteredDishes.map((dish) => {
    return <MenuItem dish={dish} key={dish.id} />;
  });

  const displayMessage = (
    <div className="flex flex-col items-center justify-center h-96">
      <TbFaceIdError className="text-9xl" />

      <h1 className="my-3 text-xl text-center">
        Uh Oh! <br /> Looks like there are No items to display. <br /> Kindly
        vary search parameters!
      </h1>
    </div>
  );

  return (
    <>
      <div className="flex flex-col p-4 max-w-[768px]  mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-7 scroll-m-20 lg:text-5xl">
          Hey there!
        </h1>
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="mb-4"
          placeholder="Search"
        />
        <div className="flex items-center my-4">
          <Switch
            checked={vegOnly}
            onCheckedChange={setVegOnly}
            className="data-[state=checked]:bg-green-500 me-3 "
          />
          <Label>Veg Only</Label>
        </div>
        {dishItems.length > 0 ? dishItems : !loading && displayMessage}
        {loading && (
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
