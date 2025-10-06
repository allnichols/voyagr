"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      // Not authenticated, redirect to login
      router.push("/auth/login");
      return;
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!session) {
    return null;
  }

  return <>{children}</>;
}

export default function ClientSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}