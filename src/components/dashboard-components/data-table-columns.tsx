"use client";

import {
  IconCircleCheckFilled,
  IconClock,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import type { PostSchemaType } from "./data-table-schema";

function ActionsCell({ row }: { row: any }) {
  const deletePost = useMutation(api.dashboard.deleteMyPost);

  const handleDelete = async () => {
    try {
      const result = await deletePost({
        postId: row.original.id as Id<"posts">,
      });
      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success("Post removed");
      }
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const tweetUrl = `https://x.com/${row.original.authorUsername}/status/${row.original.tweetId}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem asChild>
          <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
            View on X
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<PostSchemaType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "content",
    header: "Post",
    cell: ({ row }) => {
      const tweetUrl = `https://x.com/${row.original.authorUsername}/status/${row.original.tweetId}`;
      const preview = row.original.content.slice(0, 80);
      return (
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-primary block max-w-xs truncate transition-colors"
          title={row.original.content}
        >
          {preview}
          {row.original.content.length > 80 ? "…" : ""}
        </a>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm whitespace-nowrap">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {status === "queued" ? (
            <IconClock className="text-yellow-500 dark:text-yellow-400" />
          ) : (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          )}
          {status === "queued" ? "Queued" : "Published"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "engagementCount",
    header: () => <div className="w-full text-right">Engagements</div>,
    cell: ({ row }) => (
      <div className="text-right text-sm">
        {Math.floor(row.original.engagementCount ?? 0)}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
