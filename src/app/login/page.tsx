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
import { loginUser } from "@/services/Authentication/authService";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the login service
      const response = await loginUser(formData);

      // Store user data in AuthContext
      login(response.user);

      // Simply redirect to feed after successful login
      // The preferences flow will be handled by UserPreferencesContext
      router.push("/feed");
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google login logic here
    console.log("Google login clicked");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center md:p-4">
      <BackgroundCarousel />

      <div className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-2xl md:rounded-3xl h-screen md:h-auto">
        <CardHeader className="space-y-3 text-center pb-2">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight font-headline">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-200 text-base">
            Sign in to continue your Cebu adventure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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

            {/* Password Input with Forgot Password below */}
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 rounded-2xl text-base px-4"
                required
                disabled={loading}
              />
              <div className="flex justify-end pt-1">
                <Link
                  href="#"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Sign In Button - Material 3 Expressive style */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 font-semibold text-base rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
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

          {/* Google Sign In - Material 3 Expressive style */}
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-14 bg-white/10 border-white/30 hover:bg-white/20 hover:text-white text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="mr-3 h-5 w-5" />
            <span className="font-medium">Continue with Google</span>
          </Button>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-200 pt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
