"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // browser-only check
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (token) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      Redirecting...
    </div>
  );
}
