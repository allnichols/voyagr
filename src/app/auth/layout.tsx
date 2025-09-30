import React from "react";
import ReactQueryProvider from "../ReactQueryProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </ReactQueryProvider>
  );
}
