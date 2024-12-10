"use client";

import React, { useState, useEffect, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, PlusCircle, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// Types
interface Issue {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "review" | "done";
}

interface NewSprint {
  name: string;
  startDate: string;
  endDate: string;
}

interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  issues: Issue[];
}

const ProjectSprintPage = ({ params }: { params: Promise<{ Id: string }> }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projectId, setId] = useState<string>();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [isCreateIssueDialogOpen, setIsCreateIssueDialogOpen] = useState(false);
  const [newIssue, setNewIssue] = useState<Partial<Issue>>({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
  });
  const [newSprint, setNewSprint] = useState<NewSprint>({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [isCreateSprintDialogOpen, setIsCreateSprintDialogOpen] =
    useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.Id);
      console.log(resolvedParams);
    });
  }, [params]);

  // Fetch all project data
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return; // Guard clause to ensure projectId is available
      try {
        const res = await fetch("/api/projects/findall", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setSprints(data.sprints || []);
        setSelectedSprint(data.sprints?.[0] || null);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const createSprint = async () => {
    if (
      !projectId ||
      !newSprint.name ||
      !newSprint.startDate ||
      !newSprint.endDate
    ) {
      return;
    }

    try {
      const response = await fetch("/api/projects/sprints/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          ...newSprint,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create sprint");
      }

      const createdSprint = await response.json();

      // Add the new sprint to the state
      setSprints([
        ...sprints,
        {
          ...createdSprint,
          issues: [],
        },
      ]);

      // Reset form and close dialog
      setNewSprint({
        name: "",
        startDate: "",
        endDate: "",
      });
      setIsCreateSprintDialogOpen(false);
    } catch (error) {
      console.error("Error creating sprint:", error);
      // Here you might want to show an error message to the user
    }
  };

  // Update the existing createIssue function
  const createIssue = async () => {
    if (!selectedSprint || !newIssue.title || !newIssue.assignee) {
      return;
    }

    try {
      const response = await fetch("/api/projects/sprints/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sprintId: selectedSprint.id,
          ...newIssue,
          status: "todo",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create issue");
      }

      const createdIssue = await response.json();

      // Update sprints state with new issue
      const updatedSprints = sprints.map((sprint) =>
        sprint.id === selectedSprint.id
          ? { ...sprint, issues: [...sprint.issues, createdIssue] }
          : sprint
      );

      setSprints(updatedSprints);
      setSelectedSprint(
        updatedSprints.find((s) => s.id === selectedSprint.id) || null
      );

      // Reset form and close dialog
      setNewIssue({
        title: "",
        description: "",
        assignee: "",
        priority: "medium",
      });
      setIsCreateIssueDialogOpen(false);
    } catch (error) {
      console.error("Error creating issue:", error);
      // Here you might want to show an error message to the user
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, issue: Issue) => {
    e.dataTransfer?.setData("text/plain", issue.id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetStatus: Issue["status"]
  ) => {
    e.preventDefault();
    const draggedIssueId = e.dataTransfer?.getData("text/plain");
    if (!draggedIssueId || !selectedSprint) return;

    const draggedIssue = sprints
      .flatMap((sprint) => sprint.issues)
      .find((issue) => issue.id === draggedIssueId);

    if (!draggedIssue) return;

    const updatedSprints = sprints.map((sprint) =>
      sprint.id === selectedSprint.id
        ? {
            ...sprint,
            issues: sprint.issues.map((issue) =>
              issue.id === draggedIssueId
                ? { ...issue, status: targetStatus }
                : issue
            ),
          }
        : sprint
    );

    setSprints(updatedSprints);
    setSelectedSprint(
      updatedSprints.find((s) => s.id === selectedSprint.id) || null
    );
  };

  const renderKanbanColumn = (status: Issue["status"]) => {
    const issues =
      selectedSprint?.issues.filter((issue) => issue.status === status) || [];

    return (
      <div
        className="bg-gray-100 p-4 rounded-lg min-h-[400px] text-black"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <h3 className="font-semibold mb-4 capitalize">
          {status.replace("-", " ")}
        </h3>
        {issues.map((issue) => (
          <Card
            key={issue.id}
            className="mb-2 cursor-move"
            draggable
            onDragStart={(e) => handleDragStart(e, issue)}
          >
            <CardContent className="p-4">
              <p className="font-medium">{issue.title}</p>
              <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm mr-2">{issue.assignee}</span>
                <Badge
                  variant={
                    issue.priority === "high"
                      ? "destructive"
                      : issue.priority === "medium"
                      ? "default"
                      : "secondary"
                  }
                >
                  {issue.priority}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </Button>

      <Card>
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <Select
              value={selectedSprint?.id.toString()}
              onValueChange={(value) => {
                const sprint = sprints.find((s) => s.id === parseInt(value));
                setSelectedSprint(sprint || null);
              }}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select Sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id.toString()}>
                    {sprint.name} ({sprint.startDate} - {sprint.endDate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog
              open={isCreateSprintDialogOpen}
              onOpenChange={setIsCreateSprintDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="default">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Sprint
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Sprint</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Sprint Name</Label>
                    <Input
                      placeholder="Enter sprint name"
                      value={newSprint.name}
                      onChange={(e) =>
                        setNewSprint({ ...newSprint, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={newSprint.startDate}
                        onChange={(e) =>
                          setNewSprint({
                            ...newSprint,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={newSprint.endDate}
                        onChange={(e) =>
                          setNewSprint({
                            ...newSprint,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={createSprint} className="w-full">
                    Create Sprint
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog
            open={isCreateIssueDialogOpen}
            onOpenChange={setIsCreateIssueDialogOpen}
          >
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
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newIssue.title}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, title: e.target.value })
                    }
                    placeholder="Enter issue title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newIssue.description}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, description: e.target.value })
                    }
                    placeholder="Enter issue description"
                  />
                </div>
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={newIssue.assignee}
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, assignee: e.target.value })
                    }
                    placeholder="Assign to"
                  />
                </div>
                <div>
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
                            priority: priority as Issue["priority"],
                          })
                        }
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={createIssue} className="w-full">
                  Create Issue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {selectedSprint && (
        <div className="grid grid-cols-4 gap-4">
          {renderKanbanColumn("todo")}
          {renderKanbanColumn("in-progress")}
          {renderKanbanColumn("review")}
          {renderKanbanColumn("done")}
        </div>
      )}
    </div>
  );
};

export default ProjectSprintPage;
