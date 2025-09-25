"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const EmailPage = () => {
  const handleSendEmail = async () => {
    const response = await fetch("/api/send");
    const data = await response.json();
  };

  return (
    <div className="flex flex-col p-10 h-screen">
      <Button onClick={handleSendEmail}>Send Email</Button>
    </div>
  );
};

export default EmailPage;
