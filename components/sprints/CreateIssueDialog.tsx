import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Issue } from "../types";
import { useState } from "react";

interface CreateIssueDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (issue: Partial<Issue>) => void;
}

export const CreateIssueDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: CreateIssueDialogProps) => {
  const [newIssue, setNewIssue] = useState<Partial<Issue>>({
    title: "",
    description: "",
    assigneeUsername: "",
    priority: "MEDIUM",
  });

  const handleSubmit = () => {
    onSubmit(newIssue);
    setNewIssue({
      title: "",
      description: "",
      assigneeUsername: "",
      priority: "MEDIUM",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* ... (same form fields as before, but updated for new types) ... */}
        </div>
      </DialogContent>
    </Dialog>
  );
};