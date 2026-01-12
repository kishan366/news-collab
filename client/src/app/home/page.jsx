"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/login");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(userData));
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome 👋
          </h1>

          <h2 className="text-xl text-blue-600 font-semibold mb-6">
            {user.name}
          </h2>

          <p className="text-gray-600 mb-4">
            You have successfully logged in to your account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold text-gray-700">Email</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold text-gray-700">Status</h3>
              <p className="text-gray-600">Logged In</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              router.push("/login");
            }}
            className="mt-8 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
