"use client";
import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

function Dashboard({ children }) {
  const pathname = usePathname().substring(7);
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex flex-col h-full max-h-screen gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="w-6 h-6" />
              <span className="">CRUMS</span>
            </Link>
            <Button variant="outline" size="icon" className="w-8 h-8 ml-auto">
              <Bell className="w-4 h-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="sticky top-0 flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-3 px-3 py-2 ${pathname === "dashboard" ? "bg-muted text-primary" : "text-muted-foreground"} transition-all rounded-lg  hover:text-primary`}>
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/orders"
                className={`flex items-center gap-3 px-3 py-2 transition-all rounded-lg ${pathname === "orders" ? "bg-muted text-primary" : "text-muted-foreground"} hover:text-primary`}>
                <ShoppingCart className="w-4 h-4" />
                Orders
                <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
                  6
                </Badge>
              </Link>
              <Link
                href="/admin/dishes"
                className={`flex items-center gap-3 px-3 py-2 transition-all rounded-lg ${pathname === "dishes" ? "bg-muted text-primary" : "text-muted-foreground"} hover:text-primary`}>
                <Package className="w-4 h-4" />
                Dishes{" "}
              </Link>
              <Link
                href="/admin/customers"
                className={`flex items-center gap-3 px-3 py-2 transition-all rounded-lg ${pathname === "customers" ? "bg-muted text-primary" : "text-muted-foreground"} hover:text-primary`}>
                <Users className="w-4 h-4" />
                Customers
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold">
                <Package2 className="w-6 h-6" />
                <span className="sr-only">CRUMS</span>
              </Link>
              <Link
                href="/dashboard"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                <Home className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                <ShoppingCart className="w-5 h-5" />
                Orders
                <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
                  6
                </Badge>
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                <Package className="w-5 h-5" />
                Products
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                <Users className="w-5 h-5" />
                Customers
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                <LineChart className="w-5 h-5" />
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        {children}
      </div>
    </div>
  );
}

export default Dashboard;
