import { useLoading } from "@/hooks/useLoading.js";

export default function Loading() {
  const { loading } = useLoading();
  if (!loading) return;
  return (
    <div className="absolute inset-0 bg-foreground w-2/4 h-1 animate-loading-move"></div>
  );
}
