"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";

function Customers() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllDishes();
  }, []);

  async function getAllDishes() {
    const response = await fetch("/api/getalldishes");
    const data = await response.json();
    const usersData = data.data;
    setData(usersData);
  }

  return (
    <>
      <div className="container my-5">
        <h1 className="mb-4 text-2xl font-semibold">Dishes</h1>
        <DataTable columns={columns} data={data} searchColumn={"name"} />
      </div>
    </>
  );
}

export default Customers;
