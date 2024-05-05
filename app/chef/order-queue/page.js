"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function OrderQueue() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const fetchCurrentQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chef/getcurrentqueue");
      const jres = await res.json();
      if (!jres.success) {
        throw jres.message;
      }
      setData(jres.data);
    } catch (e) {
      toast({
        title: "Error",
        description: e,
        variant: "error",
        duration: 1500,
      });
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const markDishAsPrepared = async (dish) => {
    const cnf = confirm("Are you sure you want to mark this dish as prepared?");
    if (!cnf) return;
    try {
      const res = await fetch("/api/chef/markdishasprepared", {
        method: "POST",
        body: JSON.stringify(dish),
      });
      const jres = await res.json();
      if (!jres.success) {
        throw jres.message;
      }
      toast({
        title: "Success",
        description: jres.message,
        variant: "success",
        duration: 1500,
      });
      fetchCurrentQueue();
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: e,
        variant: "error",
        duration: 1500,
      });
    }
  };

  //   const realtime = supabase
  //     .channel("order-queue")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "order-queue",
  //       },
  //       (payload) => {
  //         console.log("payload:", payload.eventType);
  //         if (
  //           payload.eventType === "INSERT" ||
  //           payload.eventType === "UPDATE" ||
  //           payload.eventType === "DELETE"
  //         ) {
  //           getAllOrders();
  //         }
  //       }
  //     )
  //     .subscribe();

  useEffect(() => {
    // Fetch order queue data
    fetchCurrentQueue();
  }, []);

  const columns = [
    {
      header: "Sl. No",
      accessorKey: "_id",
      size: 50,
    },

    {
      header: "Item",
      accessorKey: "item",
      size: 120,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col justify-center">
            <h1 className="font-bold ">{row.original.item.name}</h1>
          </div>
        );
      },
    },
    {
      header: "Customizations",
      accessorKey: "",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col justify-center">
            {row.original.item.availableCustomizations
              ? Object.keys(row.original.item.chosenCustomization).map(
                  (customization) => {
                    return (
                      <h1 className="font-thin">
                        <span className="font-bold">{customization}</span>:{" "}
                        {row.original.item.chosenCustomization[customization]}
                      </h1>
                    );
                  }
                )
              : "-"}
          </div>
        );
      },
    },
    {
      header: "Qty",
      accessorKey: "",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col justify-center">
            <h1>x{row.original.item.quantity}</h1>
          </div>
        );
      },
      size: 50,
    },
    {
      header: "Special Instructions",
      accessorKey: "specialInstructions",
      size: 250,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col justify-center">
            <h1>{row.original.specialInstructions || "-"}</h1>
          </div>
        );
      },
    },
    {
      header: "Course",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col justify-center">
            <h1>{row.original.item.course}</h1>
          </div>
        );
      },
      size: 75,
    },
    {
      header: "T-No",
      accessorKey: "tableNumber",
      size: 50,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col justify-center">
            <h1>Table {row.original.tableNumber}</h1>
          </div>
        );
      },
    },
    {
      header: "Action",
      size: 50,
      cell: ({ row }) => {
        return (
          <div className="w-[100px]">
            <Button onClick={() => markDishAsPrepared(row.original)}>
              Mark as Completed
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container flex flex-col py-3 h-[100vh] w-[100vw]  justify-center ">
      {!loading && (
        <>
          <h1 className="mx-auto text-2xl font-bold my-14">Today's Orders!</h1>
          <DataTable columns={columns} data={data} />
          <footer className="flex items-center justify-between p-4 ">
            <p className="text-gray">© 2023-24 CRUMS</p>
            <p className="text-gray">All rights reserved</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default OrderQueue;
