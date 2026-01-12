"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [token] = useState(() => {
    if (typeof window === "undefined") return "";
    return (
      new URLSearchParams(window.location.search).get("token") ||
      window.location.search.split("=")[1] ||
      ""
    );
  });

  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // ✅ FIX

  const varifiuserEmail = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        { token }
      );
      setVerified(true);

      // auto redirect after success
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed");
      console.log(err?.response?.data);
    } finally {
      setLoading(false); // ✅ FIX
    }
  };

  useEffect(() => {
    if (token.length > 0) {
      varifiuserEmail();
    } else {
      setLoading(false);
      setError("Invalid or missing token");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Email Verification
        </h1>

        {loading && (
          <p className="text-blue-600 font-medium">
            Verifying your email...
          </p>
        )}

        {verified && (
          <>
            <p className="text-green-600 font-semibold mb-4">
              ✅ Email verified successfully!
            </p>
            <p className="text-gray-600 text-sm">
              Redirecting to login page...
            </p>
          </>
        )}

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded mt-4">
            {error}
          </div>
        )}

        {!loading && !verified && !error && (
          <p className="text-gray-600">
            Please wait while we verify your email.
          </p>
        )}
      </div>
    </div>
  );
}
