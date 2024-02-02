"use client";
import React, { useEffect } from "react";

function TableOrder({ params }) {
  const Cryptr = require("cryptr");
  const cryptr = new Cryptr("myTotallySecretKey");

  const encryptedString = cryptr.decrypt(params.table);

  console.log(encryptedString);

  return <h1>TableOrder: {encryptedString}</h1>;
}

export default TableOrder;
