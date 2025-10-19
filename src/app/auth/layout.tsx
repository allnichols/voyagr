import React from "react";
import ReactQueryProvider from "../ReactQueryProvider";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <h1 className="text-center absolute top-8 text-4xl font-bold">
          <Link href="/" className="text-secondary italic">
            Voyagr
          </Link>
        </h1>
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </ReactQueryProvider>
  );
}
