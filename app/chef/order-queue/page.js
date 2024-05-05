"use client";
import React, { useState, useEffect } from "react";
import DataTable from "@/components/ui/data-table";

function OrderQueue() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
      console.log(e);
    } finally {
      setLoading(false);
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
      size: 100,
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
      accessorKey: "",
    },
  ];

  return (
    <div className="container flex flex-col py-3 h-[100vh]  justify-center ">
      <h1 className="mx-auto text-2xl font-bold">Welcome to CRUMS!</h1>
      {!loading && (
        <DataTable columns={columns} data={data} searchColumn={"item"} />
      )}
    </div>
  );
}

export default OrderQueue;
