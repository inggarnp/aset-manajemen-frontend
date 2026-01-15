import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Building2,
  Lock,
  User,
  Shield,
  TrendingUp,
  BarChart3,
  Package,
} from "lucide-react";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, token } = useAuth();
  const navigate = useNavigate();

  // Redirect ke dashboard jika sudah login
  useEffect(() => {
    console.log("Login page - checking auth status:", { 
      hasUser: !!user, 
      hasToken: !!token 
    });
    
    if (user && token) {
      console.log("User already logged in, redirecting to dashboard...");
      navigate("/dashboard", { replace: true });
    }
  }, [user, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Starting login process...");
    
    try {
      await login(identifier, password);
      
      console.log("Login successful!");
      
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting...",
      });

      setTimeout(() => {
        console.log("Navigating to dashboard...");
        navigate("/dashboard", { replace: true });
      }, 500);
      
    } catch (error: any) {
      console.error("Login failed:", error);
      
      const message =
        error.response?.data?.error || 
        error.message || 
        "Login failed. Please try again.";
      
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto relative z-10 shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-blue-900 p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-600/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-14 h-14 bg-blue-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-500/20">
                <Building2 className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Asset Management
                </h1>
                <p className="text-slate-300 text-sm">System</p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-5">
                Manage Your Assets <br />
                Efficiently & Securely
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="w-9 h-9 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-0.5">
                      Complete Asset Tracking
                    </h3>
                    <p className="text-slate-300 text-xs">
                      Monitor all your assets in real-time with comprehensive
                      tracking
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="w-9 h-9 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-0.5">
                      Depreciation Management
                    </h3>
                    <p className="text-slate-300 text-xs">
                      Automated depreciation calculations and financial
                      reporting
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="w-9 h-9 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-0.5">
                      Smart Analytics
                    </h3>
                    <p className="text-slate-300 text-xs">
                      Get insights and analytics to optimize asset utilization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="relative z-10 text-slate-400 text-xs">
            <p>© 2025 Asset Management System</p>
            <p className="mt-1">All rights reserved</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full lg:w-1/2 bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 flex flex-col justify-center border-0">
          <div className="max-w-sm mx-auto w-full">
            {/* Mobile Logo (visible only on small screens) */}
            <div className="lg:hidden mb-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Asset Management
              </h1>
            </div>

            {/* Form Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Welcome Back
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="identifier"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email / Phone / Username
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isLoading}
                    className="pl-14 h-12 text-sm border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Lock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-14 h-12 text-sm border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-slate-700 to-blue-800 hover:from-slate-800 hover:to-blue-900 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>

            {/* Security Badge */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 py-2.5 px-3 rounded-lg">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-medium">
                Secured with end-to-end encryption
              </span>
            </div>

            {/* Footer Info */}
            <div className="mt-6 text-center space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p>Having trouble signing in?</p>
              <p className="text-blue-700 dark:text-blue-400 hover:underline cursor-pointer font-medium">
                Contact your system administrator
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p>
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    className="text-blue-700 dark:text-blue-400 hover:underline cursor-pointer font-semibold"
                  >
                    Register here
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;