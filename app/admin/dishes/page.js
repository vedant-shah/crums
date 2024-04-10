"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Steps, StepsItem, StepsCompleted } from "@saas-ui/react";

import { TbPlus } from "react-icons/tb";

function Customers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const steps = [
    {
      name: "step 1",
      title: "First step",
      children: <div py="4">Content step 1</div>,
    },
    {
      name: "step 2",
      title: "Second step",
      children: <div py="4">Content step 2</div>,
    },
    {
      name: "step 3",
      title: "Third step",
      children: <div py="4">Content step 3</div>,
    },
  ];

  const { toast } = useToast;

  useEffect(() => {
    getAllDishes();
  }, []);

  async function getAllDishes() {
    try {
      setLoading(true);
      const response = await fetch("/api/getalldishes");
      const data = await response.json();
      if (!data.success) throw data.message;
      const usersData = data.data;
      setData(usersData);
    } catch (error) {
      toast({
        title: "Error",
        message: error,
        variant: "error",
        duration: 1500,
      });
    } finally {
      setLoading(false);
    }
    setLoading(false);
  }

  const columns = [
    {
      accessorKey: "isVeg",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.getValue("isVeg") ? (
            <Image
              src="https://img.icons8.com/color/480/vegetarian-food-symbol.png"
              style={{ width: "15px", height: "15px" }}
              className="inline-flex me-3"
              width={15}
              height={15}
              alt=""
            />
          ) : (
            <Image
              src="/non-veg.png"
              style={{ width: "15px", height: "15px" }}
              className="inline-flex me-3"
              width={15}
              height={15}
              alt=""
            />
          )}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="w-[150px] truncate">
          <span>{row.getValue("description")}</span>
        </div>
      ),
    },
    {
      accessorKey: "course",
      header: "Course",
    },
    {
      accessorKey: "cuisine",
      header: "Cuisine",
    },
    {
      accessorKey: "calories",
      header: "Calories",
      cell: ({ row }) => <span>{row.getValue("calories")} Kcal</span>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span>₹{row.getValue("price").toFixed(2)}</span>,
    },
    {
      accessorKey: "available",
      header: "Available",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Switch
              checked={row.getValue("available")}
              onClick={() =>
                handleCheckChange(row.original._id, !row.original.available)
              }
            />
          </div>
        );
      },
    },
  ];

  async function handleCheckChange(id, updatedValue) {
    try {
      const response = await fetch("/api/admin/updateavailability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          updatedValue,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw data.message;
      }
      toast({
        title: "Success",
        description: data.message,
        variant: "success",
        duration: 1500,
      });
      getAllDishes();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: err,
        variant: "error",
        duration: 1500,
      });
    }
  }

  return (
    <>
      <div className="container my-5">
        <div className="flex justify-between">
          <h1 className="mb-4 text-2xl font-semibold">Dishes</h1>
          {!loading && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <TbPlus />
                  New Dish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div>
                  <Steps step={step} mb="2">
                    {steps.map((args, i) => (
                      <StepsItem key={i} {...args} />
                    ))}
                    <StepsCompleted py="4">Completed</StepsCompleted>
                  </Steps>
                </div>
                <DialogHeader>
                  <DialogTitle>Add a New Dish</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {loading && (
          <div className="flex items-center w-full h-16">
            <Loader2 className="w-full animate-spin" />
          </div>
        )}
        {!loading && (
          <DataTable columns={columns} data={data} searchColumn={"name"} />
        )}
      </div>
    </>
  );
}

export default Customers;
