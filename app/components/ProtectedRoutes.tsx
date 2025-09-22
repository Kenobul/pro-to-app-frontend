"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/"); // redirect if not logged in
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <p className="text-center mt-20">Checking authentication...</p>;
  }

  return <>{children}</>;
}
