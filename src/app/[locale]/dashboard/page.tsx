import { ChartAreaInteractive } from "@/app/[locale]/dashboard/chart-area-interactive";
import { DataTable } from "@/app/[locale]/dashboard/data-table";
import { SectionCards } from "@/app/[locale]/dashboard/section-cards";

import data from "./data.json";

export default function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
