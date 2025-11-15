import { NotFound } from "@/components/not-found";

export default function DashboardNotFoundPage() {
  return (
    <div className="relative flex-1 flex flex-col">
      <NotFound showSidebar={true} />
    </div>
  );
}

