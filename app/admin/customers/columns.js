"use client";
import dayjs from "dayjs";
export const columns = [
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return <span>{row.getValue("phone").substring(2)}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <span>
        {dayjs(row.getValue("created_at")).format("MMMM D, YYYY h:mm A")}
      </span>
    ),
  },
  {
    accessorKey: "last_sign_in_at",
    header: "Last Used",
    cell: ({ row }) => (
      <span>
        {dayjs(row.getValue("last_sign_in_at")).format("MMMM D, YYYY h:mm A")}
      </span>
    ),
  },
];
