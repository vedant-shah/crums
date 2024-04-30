"use client";
import React, { useState, useEffect } from "react";

function Page() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discount: "",
    type: "",
    minOrderAmount: "",
    maxDiscount: "",
    maxRedemption: "",
    startDate: "",
    endDate: "",
    active: false,
  });

  return (
    <div className="p-3 w-full flex flex-col items-center justify-center">
      <h1 className="text-xl inline font-bold mx-auto">Manage Coupons</h1>
    </div>
  );
}

export default Page;
