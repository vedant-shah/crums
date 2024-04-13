"use client";
import React, { useEffect, useState } from "react";
import { IndianRupee, Users, ArrowUpRight } from "lucide-react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dayjs from "dayjs";

function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState();
  useEffect(() => {
    getAnalytics();
  }, []);

  const getAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      const userData = await fetch("/api/admin/getallusers");
      const user = await userData.json();
      const data = await response.json();
      if (!data.success || !user.success) throw data.message;
      let analyticData = data.data;
      analyticData.userCount = user.data.length;
      setAnalyticsData(analyticData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col flex-1 gap-4 p-4 overflow-y-auto md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{" "}
              {analyticsData?.monthlyRevenue?.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              }) || "0.00"}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              for {new Date().toLocaleString("default", { month: "long" })},{" "}
              {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.userCount?.toLocaleString("en-IN") || "0"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium">
              The Most Popular Dish of the Month was
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {analyticsData?.mostFrequentItem[0]}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              ordered {analyticsData?.mostFrequentItem[1]} times!
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Recent transactions from your store.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="gap-1 ml-auto">
              <Link href="#">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OrderID</TableHead>
                  <TableHead className="hidden xl:table-column">Type</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Status
                  </TableHead>
                  <TableHead className="hidden md:table-cell lg:hidden xl:table-column">
                    Date
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData?.recentOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.orderId}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {dayjs(order.created_at).format("h:mm A MMM D, YYYY ")}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      Sale
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      <Badge className="text-xs" variant="outline">
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{" "}
                      {(order.total + order.gst).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full h-full">
        <ResponsiveContainer width="50%" height="95%">
          <LineChart width={300} height={300} data={analyticsData?.monthlyData}>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="month" />
            <YAxis />
            {/* <Tooltip /> */}
            <Legend />
            <Line
              type="linear"
              dataKey="noOfOrders"
              stroke="#fff"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="50%" height="95%">
          <BarChart width={500} height={300} data={analyticsData?.monthlyData}>
            <XAxis dataKey="month" />
            <Legend />
            <YAxis />
            {/* <Tooltip /> */}
            <Bar dataKey="revenue" fill="#abfb1a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Dashboard;
