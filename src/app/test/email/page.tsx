"use client";

import { Button } from "@/components/ui/button";

const EmailPage = () => {
  const handleSendEmail = async () => {
    try {
      await fetch("/api/send");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  return (
    <div className="flex h-screen flex-col p-10">
      <Button onClick={handleSendEmail}>Send Email</Button>
    </div>
  );
};

export default EmailPage;
