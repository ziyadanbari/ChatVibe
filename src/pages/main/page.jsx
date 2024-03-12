import useSession from "@/hooks/useSession.js";
import Sidebar from "@/layouts/Sidebar.jsx";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import UserOptions from "@/components/userOptions.jsx";
import { Outlet } from "react-router-dom";
export default function Main() {
  return (
    <div className="w-full h-full flex">
      <div className="lg:w-[30%] md:w-[37%]  h-full md:block hidden">
        <Sidebar />
      </div>
      <div className="md:hidden inline-flex justify-between items-center flex-col h-full px-1 py-3">
        <div>
          <Sheet modal={false}>
            <SheetTrigger
              className="hover:bg-main-dark-gray rounded-full "
              asChild>
              <ChevronRight className=" text-light-gray" />
            </SheetTrigger>
            <SheetContent
              className="w-screen h-screen !p-0 md:!hidden block"
              side={"left"}>
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex-1 h-full">
        <Outlet />
      </div>
    </div>
  );
}
