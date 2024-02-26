import { DataContext } from "@/providers/DataProvider.jsx";
import { useContext } from "react";

export function useLoading() {
  return useContext(DataContext).loading;
}
