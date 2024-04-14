"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TbPlus } from "react-icons/tb";

function Customers() {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    course: "",
    cuisine: "",
    calories: "",
    price: "",
    cookTime: "",
    imgUrl: "",
    available: false,
    isVeg: false,
  });

  const handleUpdateDish = async () => {
    try {
      const response = await fetch("/api/admin/updatedish", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      setFormData({
        name: "",
        description: "",
        course: "",
        cuisine: "",
        calories: "",
        price: "",
        cookTime: "",
        imgUrl: "",
        available: false,
        isVeg: false,
      });
      setOpen(false);
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
  };

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
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const dish = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setFormData(dish);
                  setIsEditing(true);
                  setOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

  const inputFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter the name of the dish",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter the description of the dish",
    },
    {
      name: "course",
      label: "Course",
      type: "text",
      placeholder: "Enter the course of the dish",
    },
    {
      name: "cuisine",
      label: "Cuisine",
      type: "text",
      placeholder: "Enter the cuisine of the dish",
    },
    {
      name: "calories",
      label: "Calories",
      type: "number",
      placeholder: "Enter the calories of the dish",
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter the price of the dish",
    },
    {
      name: "cookTime",
      label: "Cooking Time",
      type: "number",
      placeholder: "Enter the cooking time of the dish",
    },
    {
      name: "imgUrl",
      label: "Image URL",
      type: "text",
      placeholder: "Enter the image URL of the dish",
    },
    {
      name: "available",
      label: "Available",
      type: "checkbox",
      placeholder: "Is the dish available?",
    },
    {
      name: "isVeg",
      label: "Is Veg",
      type: "checkbox",
      placeholder: "Is the dish vegetarian?",
    },
  ];

  const addNewDish = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await fetch("/api/admin/addNewDish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      setFormData({
        name: "",
        description: "",
        course: "",
        cuisine: "",
        calories: "",
        price: "",
        cookTime: "",
        imgUrl: "",
        available: false,
        isVeg: false,
      });
      setOpen(false);
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
  };
  return (
    <>
      <div className="container my-5">
        <div className="flex justify-between">
          <h1 className="mb-4 text-2xl font-semibold">Dishes</h1>
          {!loading && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <TbPlus />
                  New Dish
                </Button>
              </DialogTrigger>
              <DialogContent
                style={{
                  minWidth: "50vw",
                  minHeight: "60vh",
                }}
              >
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Edit Dish" : "Add  a New Dish"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={addNewDish}>
                  <div className="grid grid-cols-2 gap-4">
                    {inputFields.map((field) => (
                      <div key={field.name}>
                        {field.type === "checkbox" ? (
                          <div className="flex items-center">
                            <Checkbox
                              id={field.name}
                              checked={formData[field.name]}
                              onClick={(e) => {
                                console.log();
                                setFormData({
                                  ...formData,
                                  [field.name]:
                                    e.target.getAttribute("data-state") ===
                                    "checked"
                                      ? false
                                      : true,
                                });
                              }}
                            />
                            <label
                              htmlFor={field.name}
                              className="text-sm ms-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {field.placeholder}
                            </label>
                          </div>
                        ) : (
                          <>
                            <label htmlFor={field.name}>{field.label}</label>
                            <Input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [field.name]: e.target.value,
                                })
                              }
                              id={field.name}
                              placeholder={field.placeholder}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    {isEditing ? (
                      <Button type="button" onClick={handleUpdateDish}>
                        Update Dish
                      </Button>
                    ) : (
                      <Button type="submit">Add Dish</Button>
                    )}
                  </div>
                </form>
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
