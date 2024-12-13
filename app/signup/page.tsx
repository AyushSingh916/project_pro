"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";  // Import Link from next/link
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GoogleIcon, GithubIcon } from "@/components/icons/CustomIcons";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");
    setOtpError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }

    if (isOtpSent && !otp.trim()) {
      setOtpError("OTP is required");
      isValid = false;
    }

    return isValid;
  };

  const sendOtp = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast({
          variant: "default",
          title: "OTP Sent",
          description: "Please check your email for the OTP.",
        });
        setIsOtpSent(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "An error occurred while sending OTP.",
        });
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        await signUp();
      } else {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          description: data.message || "Please try again.",
        });
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while verifying OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast({
          variant: "default",
          title: "Signup Successful",
          description: "Please log in to continue.",
        });
        window.location.href = "/signin";
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "An error occurred. Please try again.",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, {
        callbackUrl: "/",
        redirect: true,
      });
      
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to sign in with " + provider,
        });
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during authentication.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      await sendOtp();
    } else {
      await verifyOtp();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 shadow-2xl rounded-2xl overflow-hidden border border-gray-700">
          <div className=" px-8 py-6">
            <h1 className="text-4xl font-extrabold text-center text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Welcome
            </h1>
            <p className="text-center text-white/80 mt-2 text-sm">
              Create your account to get started
            </p>
          </div>
          
          <div className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label 
                  htmlFor="email" 
                  className="block text-gray-300 mb-2 font-semibold text-sm tracking-tight"
                >
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border-gray-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-300 rounded-lg"
                  disabled={isLoading}
                />
                {emailError && (
                  <span className="text-red-500 text-xs mt-1 block pl-1">
                    {emailError}
                  </span>
                )}
              </div>

              {!isOtpSent && (
                <div>
                  <Label 
                    htmlFor="password" 
                    className="block text-gray-300 mb-2 font-semibold text-sm tracking-tight"
                  >
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full border-gray-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-300 rounded-lg"
                    disabled={isLoading}
                  />
                  {passwordError && (
                    <span className="text-red-500 text-xs mt-1 block pl-1">
                      {passwordError}
                    </span>
                  )}
                </div>
              )}

              {isOtpSent && (
                <div>
                  <Label 
                    htmlFor="otp" 
                    className="block text-gray-300 mb-2 font-semibold text-sm tracking-tight"
                  >
                    One-Time Password (OTP)
                  </Label>
                  <Input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full border-gray-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-300 rounded-lg"
                    disabled={isLoading}
                  />
                  {otpError && (
                    <span className="text-red-500 text-xs mt-1 block pl-1">
                      {otpError}
                    </span>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sky-300/50"
                disabled={isLoading}
              >
                {isLoading
                  ? isOtpSent
                    ? "Verifying OTP..."
                    : "Sending OTP..."
                  : isOtpSent
                  ? "Verify OTP"
                  : "Send OTP"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-900 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleOAuthSignUp("google")}
                className="w-full bg-gray-800 text-white hover:from-red-600 hover:to-red-800"
              >
                <GoogleIcon />
                Google
              </Button>
              <Button
                onClick={() => handleOAuthSignUp("github")}
                className="w-full bg-gray-800 text-white hover:bg-gray-700"
              >
                <GithubIcon/>
                GitHub
              </Button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/signin" className="text-sky-500 hover:text-sky-600 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
