// StatusMessage.tsx
import React from "react";
import { StatusMessageProps } from "@/types";

const StatusMessage: React.FC<StatusMessageProps> = ({ status }) => {
  if (!status) return null;

  return (
    <div
      className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
      role="alert"
    >
      <p className="font-bold">Status Update</p>
      <p>{status}</p>
    </div>
  );
};

export default StatusMessage;
