"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "../services/auth.service";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email) throw new Error("Email not found");

      await verifyOtp({ email, otp });
      router.push("/login");
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Verify your email
        </h1>

        <p className="text-sm text-center text-gray-600 mb-6">
          We have sent a 6-digit OTP to  
          <br />
          <span className="font-medium">{email}</span>
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full text-center tracking-widest text-lg px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Didn’t receive OTP?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}
