"use client";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

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
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}
export const columns = [
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
