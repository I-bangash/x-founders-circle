"use client";

import { Button } from "@/components/ui/button";

const EmailPage = () => {
  const handleSendEmail = async () => {
    const response = await fetch("/api/send");
    const data = await response.json();
  };

  return (
    <div className="flex h-screen flex-col p-10">
      <Button onClick={handleSendEmail}>Send Email</Button>
    </div>
  );
};

export default EmailPage;
