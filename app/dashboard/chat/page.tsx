"use client";

import React from "react";
import ChatUI from "./chat-form";

const ChatForm = () => {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
   const role =
  typeof window !== "undefined" ? localStorage.getItem("role") || "user" : "";

  return (
    <div className="container mx-auto p-4">
 

<ChatUI userId={userId} accessToken={accessToken} role={role} />


    </div>
  );
};

export default ChatForm;
