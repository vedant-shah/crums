import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function SkeletonMenuItem() {
  return (
    <>
      <Card className="flex p-2 my-3 max-w-[768px] lg-min-w-[768px] h-[150px]">
        <div className="w-[70%] ps-1 py-2 pe-4">
          <Skeleton className="w-[80%] my-2 h-7 " />
          <Skeleton className="w-[20%] my-2 h-3 " />
          <Skeleton className="w-[100%] my-2 h-12 " />
        </div>
        <div className="w-[30%] flex justify-end items-center relative">
          <Skeleton className="w-[100px] h-[100px] my-2 " />
        </div>
      </Card>
    </>
  );
}

export default SkeletonMenuItem;
