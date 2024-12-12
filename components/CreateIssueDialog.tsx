import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

type Collaborator = {
  id: string;
  username: string;
  email: string;
};

type NewIssue = {
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
};

type CreateIssueDialogProps = {
  isOpen: boolean;
  setIsCreateIssueDialogOpen: (isOpen: boolean) => void;
  newIssue: NewIssue;
  setNewIssue: React.Dispatch<React.SetStateAction<NewIssue>>;
  createIssue: () => void;
  collaborators: Collaborator[];
};

const CreateIssueDialog: React.FC<CreateIssueDialogProps> = ({
  isOpen,
  setIsCreateIssueDialogOpen,
  newIssue,
  setNewIssue,
  createIssue,
  collaborators,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsCreateIssueDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Issue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={newIssue.title}
            onChange={(e) =>
              setNewIssue({ ...newIssue, title: e.target.value })
            }
            placeholder="Enter issue title"
          />
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newIssue.description}
            onChange={(e) =>
              setNewIssue({ ...newIssue, description: e.target.value })
            }
            placeholder="Enter issue description"
          />
          <Label htmlFor="assignee">Assignee</Label>
          <select
            id="assignee"
            value={newIssue.assignee}
            onChange={(e) =>
              setNewIssue({ ...newIssue, assignee: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
          >
            <option value="" disabled>
              Select a collaborator
            </option>
            {collaborators.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.username}>
                {collaborator.username} ({collaborator.email})
              </option>
            ))}
          </select>
          <Label>Priority</Label>
          <div className="flex space-x-2 mt-2">
            {["low", "medium", "high"].map((priority) => (
              <Button
                key={priority}
                variant={
                  newIssue.priority === priority ? "default" : "outline"
                }
                onClick={() =>
                  setNewIssue({
                    ...newIssue,
                    priority: priority as "low" | "medium" | "high",
                  })
                }
              >
                {priority}
              </Button>
            ))}
          </div>
          <Button onClick={createIssue} className="w-full">
            Create Issue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueDialog;
