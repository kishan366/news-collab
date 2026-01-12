"use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { registerUser } from "../services/auth.service";

// export default function RegisterPage() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function submit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await registerUser({ name, email, password });
//       router.push(`/verify-otp?email=${email}`);
//     } catch (err) {
//       setError(err.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        
//         <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Create your account
//         </h1>

//         {error && (
//           <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={submit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               placeholder="Your name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Create a password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               minLength={6}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
//           >
//             {loading ? "Sending OTP..." : "Register"}
//           </button>
//         </form>

//         <p className="text-sm text-center text-gray-600 mt-6">
//           Already have an account?{" "}
//           <span
//             onClick={() => router.push("/login")}
//             className="text-blue-600 cursor-pointer hover:underline"
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }
import React, { use, useState } from 'react'
import axios from 'axios';
import {toast} from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();

const [user, setUser] = useState({
  name: "",
  email: "",
  password: ""    
})


const [buttondisabled, setButtondisabled] = useState(false)

const [loading, setLoading] = useState(false)

const onRegister = async () => {
  e.preventDefault();
try {
  setLoading(true);
  const response = await axios.post("/api/auth/register", user);  
  console.log("Registration successful", response.data);
  router.push(`/verify-otp?email=${user.email}`);

} catch (error) {
  console.log("Registration failed:", error);
  toast.error(error.message);

}

}

useEffect(() => {
  if(user.name.length > 0 && user.email.length > 0 && user.password.length > 0){
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setButtondisabled(false);
  } else {
    setButtondisabled(true);
  }
}, [user])


   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create your account
        </h1>

        <form onSubmit={onRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={user.name}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={user.password}
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
              minLength={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={buttondisabled || loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

