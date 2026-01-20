"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, LogIn, Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("bmi_users") || "[]");

      // Find user
      const user = users.find(
        (u: any) => u.username === formData.username && u.password === formData.password
      );

      if (user) {
        // Save current user
        localStorage.setItem("bmi_currentUser", JSON.stringify({
          id: user.id,
          username: user.username
        }));
        
        // Redirect to dashboard
        router.push("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-gray-400 font-medium">Sign in to continue to BMI Pro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-950/30 border border-red-900 text-red-400 text-sm rounded-lg font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-black placeholder-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-black placeholder-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <span className="flex items-center gap-2">
                Sign in <LogIn className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-blue-500 hover:text-blue-400 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
