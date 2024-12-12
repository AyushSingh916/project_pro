"use client";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isOtpSent) {
      await sendOtp();
    } else {
      await verifyOtp();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full"
              disabled={isLoading}
            />
            {emailError && (
              <span className="text-red-500 text-sm mt-1 block">
                {emailError}
              </span>
            )}
          </div>
          {!isOtpSent && (
            <div>
              <Label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full"
                disabled={isLoading}
              />
              {passwordError && (
                <span className="text-red-500 text-sm mt-1 block">
                  {passwordError}
                </span>
              )}
            </div>
          )}
          {isOtpSent && (
            <div>
              <Label htmlFor="otp" className="block text-gray-700 mb-2">
                OTP
              </Label>
              <Input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP"
                className="w-full"
                disabled={isLoading}
              />
              {otpError && (
                <span className="text-red-500 text-sm mt-1 block">
                  {otpError}
                </span>
              )}
            </div>
          )}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
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
      </Card>
    </div>
  );
}
