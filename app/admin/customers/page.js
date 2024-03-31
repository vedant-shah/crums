"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import dayjs from "dayjs";
function Customers() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {
    const response = await fetch("/api/admin/getallusers");
    const data = await response.json();
    const usersData = data.data;
    setData(usersData);
  }

  return (
    <>
      <div className="container my-5">
        <h1 className="mb-4 text-2xl font-semibold">Customers</h1>
        <DataTable columns={columns} data={data} searchColumn={"phone"} />
      </div>
    </>
  );
}

export default Customers;
