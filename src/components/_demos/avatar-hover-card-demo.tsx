import { MessageCircle, UserPlus } from "lucide-react";

import { Component } from "@/components/avatar-hover-card";
import { Button } from "@/components/ui/button";

export default function DemoOne() {
  return (
    <Component
      imageSrc="https://github.com/shadcn.png"
      imageAlt="Profile"
      name="shadcn"
      username="shadcn"
      description="Community manager and content creator."
      buttonContent={
        <div className="flex w-full gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button size="sm" className="flex-1">
            <UserPlus className="mr-2 h-4 w-4" />
            Follow
          </Button>
        </div>
      }
    />
  );
}
