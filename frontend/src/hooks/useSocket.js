import { DataContext } from "@/providers/DataProvider.jsx";
import { useContext } from "react";

export default function useSocket() {
  return useContext(DataContext).socket;
}
