"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BackgroundCarousel } from "@/components/auth/BackgroundCarousel";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Loader2 } from "lucide-react";
import { registerUser } from "@/services/Authentication/authService";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the registration service
      const response = await registerUser(formData);

      // Store user data in AuthContext
      login(response.user);

      // Redirect to verify email page or home page
      router.push("/verify-email");
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Google signup logic here
    console.log("Google signup clicked");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center md:p-4">
      <BackgroundCarousel />

      <div className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-2xl md:rounded-3xl">
        <CardHeader className="space-y-3 text-center pb-2">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight font-headline">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-200 text-base">
            Start your journey exploring Cebu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-200"
              >
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 rounded-2xl text-base px-4"
                required
                disabled={loading}
              />
            </div>

            {/* Username Input */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-200"
              >
                Username
              </Label>
              <Input
                id="username"
                placeholder="Choose a username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 rounded-2xl text-base px-4"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-400 pt-1">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-200"
              >
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 rounded-2xl text-base px-4"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-200"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 rounded-2xl text-base px-4"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-400 pt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 font-semibold text-base rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent backdrop-blur-sm px-4 text-gray-300 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign Up */}
          <Button
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full h-14 bg-white/10 border-white/30 hover:bg-white/20 hover:text-white text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="mr-3 h-5 w-5" />
            <span className="font-medium">Continue with Google</span>
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-200 pt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 pt-2">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </div>
    </div>
  );
}
