"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import UploadAvatar from "@/components/Modals/upload";

export default function UserModal({ user, isOpen, onClose, onSignOut }: any) {
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState(user.password || "");
  const router = useRouter(); 

  const handleEmailChange = async () => {
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Email updated successfully!",
        });
      } else {
        throw new Error("Failed to update email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
      console.error("Error updating email:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password updated successfully!",
        });
        setNewPassword("");
      } else {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please sign in again.",
        variant: "destructive",
      });
      console.error("Error updating password:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await onSignOut();
      router.push("/"); // Redirect to homepage after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {user.username && <UploadAvatar username={user.username}/>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1"
            />
            <Button onClick={handleEmailChange} className="mt-2 w-full">
              Update Email
            </Button>
          </div>

          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
            />
            <Button onClick={handlePasswordChange} className="mt-2 w-full">
              Update Password
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={onClose} className="mt-1">
            Close
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}