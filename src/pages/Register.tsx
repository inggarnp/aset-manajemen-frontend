import React, { useState } from "react";
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
  Mail,
  Phone,
  CreditCard,
  Shield,
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import api from "@/api/axios";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nama_user: "",
    email: "",
    password: "",
    phone_number: "",
    nik: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.nama_user.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.password.trim()) {
      toast({
        title: "Validation Error",
        description: "Password is required",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/register", formData);

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      toast({
        title: "Registration Failed",
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
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto relative z-10 shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-800 to-blue-900 p-10 flex-col justify-between relative overflow-hidden">
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

            {/* Welcome Message */}
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl font-bold text-white">
                Join Our Platform
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Create your account to start managing your assets efficiently
                and securely. Get access to powerful tools and analytics.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Real-time asset tracking</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Automated depreciation reports</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Comprehensive analytics dashboard</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Secure data encryption</span>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="relative z-10 text-slate-400 text-xs">
            <p>© 2025 Asset Management System</p>
            <p className="mt-1">All rights reserved</p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <Card className="w-full lg:w-3/5 bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 flex flex-col justify-center border-0">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo (visible only on small screens) */}
            <div className="lg:hidden mb-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Asset Management
              </h1>
            </div>

            {/* Back to Login Link */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>

            {/* Form Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Create Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Fill in your details to get started
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="nama_user"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Input
                    id="nama_user"
                    name="nama_user"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.nama_user}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-14 h-12 text-sm border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
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
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Lock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-14 h-12 text-sm border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="phone_number"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Phone Number
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="text"
                    placeholder="081234567890"
                    value={formData.phone_number}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-14 h-12 text-sm border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* NIK Input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="nik"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  NIK (ID Number)
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <Input
                    id="nik"
                    name="nik"
                    type="text"
                    placeholder="3201234567890123"
                    value={formData.nik}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-14 h-12 text-sm border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-slate-700 to-blue-800 hover:from-slate-800 hover:to-blue-900 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </span>
                )}
              </Button>
            </form>

            {/* Security Badge */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 py-2.5 px-3 rounded-lg">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-medium">
                Your data is protected with encryption
              </span>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-700 dark:text-blue-400 hover:underline font-medium"
              >
                Sign in here
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;