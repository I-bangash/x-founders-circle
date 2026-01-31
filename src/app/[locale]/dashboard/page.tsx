import { ChartAreaInteractive } from "@/app/[locale]/dashboard/chart-area-interactive";
import { DataTable } from "@/app/[locale]/dashboard/data-table";
import { SectionCards } from "@/app/[locale]/dashboard/section-cards";

import dashboardData from "./data.json";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCards />

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      <DataTable data={dashboardData} />
    </div>
  );
}
