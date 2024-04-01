"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { useToast } from "@/components/ui/use-toast";
function Customers() {
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/getallusers");
      const data = await response.json();
      if (!data.success) throw data.message;
      const usersData = data.data;
      setData(usersData);
    } catch (error) {
      // Handle the error here
      toast({
        title: "Error",
        description: error,
        variant: "error",
        duration: 1500,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container my-5">
        <h1 className="mb-4 text-2xl font-semibold">Customers</h1>
        {loading && (
          <div className="flex items-center w-full h-16">
            <Loader2 className="w-full animate-spin" />
          </div>
        )}
        {!loading && (
          <DataTable columns={columns} data={data} searchColumn={"phone"} />
        )}
      </div>
    </>
  );
}

export default Customers;
