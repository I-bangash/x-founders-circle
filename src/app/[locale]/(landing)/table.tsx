import Image from "next/image";

import { cn } from "@/utils/utils";

interface Customer {
  id: number;
  date: string;
  status: "Paid" | "Ref" | "Cancelled";
  statusVariant: "success" | "warning" | "danger";
  name: string;
  avatar: string;
  revenue: string;
}

const CUSTOMERS: Customer[] = [
  {
    id: 1,
    date: "10/31/2023",
    status: "Paid",
    statusVariant: "success",
    name: "Bernard Ng",
    avatar: "https://avatars.githubusercontent.com/u/31113941?v=4",
    revenue: "$43.99",
  },
  {
    id: 2,
    date: "10/21/2023",
    status: "Ref",
    statusVariant: "warning",
    name: "Méschac Irung",
    avatar: "https://avatars.githubusercontent.com/u/47919550?v=4",
    revenue: "$19.99",
  },
  {
    id: 3,
    date: "10/15/2023",
    status: "Paid",
    statusVariant: "success",
    name: "Glodie Ng",
    avatar: "https://avatars.githubusercontent.com/u/99137927?v=4",
    revenue: "$99.99",
  },
  {
    id: 4,
    date: "10/12/2023",
    status: "Cancelled",
    statusVariant: "danger",
    name: "Theo Ng",
    avatar: "https://avatars.githubusercontent.com/u/68236786?v=4",
    revenue: "$19.99",
  },
];

export const Table = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "bg-background shadow-foreground/5 inset-ring-background ring-foreground/5 relative w-full overflow-hidden rounded-xl border border-transparent p-6 shadow-md ring-1 inset-ring-1",
        className
      )}
    >
      <TableHeader />
      <CustomerTable />
    </div>
  );
};

const TableHeader = () => (
  <div className="mb-6">
    <div className="flex gap-1.5">
      <div className="bg-muted size-2 rounded-full border border-black/5" />
      <div className="bg-muted size-2 rounded-full border border-black/5" />
      <div className="bg-muted size-2 rounded-full border border-black/5" />
    </div>
    <div className="mt-3 text-lg font-medium">Customers</div>
    <p className="mt-1 text-sm">
      New users by First user primary channel group (Default Channel Group)
    </p>
  </div>
);

const CustomerTable = () => (
  <table
    className="w-max table-auto border-collapse lg:w-full"
    data-rounded="medium"
  >
    <thead className="dark:bg-background bg-gray-950/5">
      <tr className="*:border *:p-3 *:text-left *:text-sm *:font-medium">
        <th className="rounded-l-[--card-radius]">#</th>
        <th>Date</th>
        <th>Status</th>
        <th>Customer</th>
        <th className="rounded-r-[--card-radius]">Revenue</th>
      </tr>
    </thead>
    <tbody className="text-sm">
      {CUSTOMERS.map((customer) => (
        <tr key={customer.id} className="*:border *:p-2">
          <td>{customer.id}</td>
          <td>{customer.date}</td>
          <td>
            <StatusBadge
              status={customer.status}
              variant={customer.statusVariant}
            />
          </td>
          <td>
            <div className="text-title flex items-center gap-2">
              <div className="size-6 overflow-hidden rounded-full">
                <Image
                  src={customer.avatar}
                  alt={customer.name}
                  width={120}
                  height={120}
                  className="size-full object-cover"
                  unoptimized
                />
              </div>
              <span className="text-foreground">{customer.name}</span>
            </div>
          </td>
          <td>{customer.revenue}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const StatusBadge = ({
  status,
  variant,
}: {
  status: string;
  variant: string;
}) => {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs",
        variant === "success" && "bg-lime-500/15 text-lime-800",
        variant === "danger" && "bg-red-500/15 text-red-800",
        variant === "warning" && "bg-yellow-500/15 text-yellow-800"
      )}
    >
      {status}
    </span>
  );
};
