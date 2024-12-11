"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import KanbanBoard from "@/components/KanbanBoard";
import AddCollaboratorModal from "@/components/addcollabarators";
import { Issue, Sprint, NewSprint, Collaborator } from "@/components/types";

const ProjectSprintPage = ({ params }: { params: Promise<{ Id: string }> }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [projectId, setId] = useState<string>();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [isCreateIssueDialogOpen, setIsCreateIssueDialogOpen] = useState(false);
  const [isAddCollaboratorModalOpen, setIsAddCollaboratorModalOpen] =
    useState(false);
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateSprintDialogOpen, setIsCreateSprintDialogOpen] =
    useState(false);
  const [collaborators, setcollaborators] = useState<Collaborator[]>([]);
  const [issues, setissues] = useState([]);
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.Id);
    });
  }, [params]);

  // Fetch all project data
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;

      try {
        const res = await fetch("/api/projects/findall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setSprints(data.sprints || []);
        setcollaborators(data.collab || []);
        setSelectedSprint(data.sprints?.[0] || null);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // Fetch issues for the selected sprint
  useEffect(() => {
    const fetchIssuesForSprint = async () => {
      if (!selectedSprint?.id) return;

      setIssueError(null);

      try {
        const response = await fetch(
          `/api/projects/sprints/issues/find/?sprintId=${selectedSprint.id}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) throw new Error(`Failed to fetch issues`);

        const data = await response.json();

        setSprints((prevSprints) =>
          prevSprints.map((sprint) =>
            sprint.id === selectedSprint.id
              ? { ...sprint, issues: data.issues }
              : sprint
          )
        );
      } catch (error) {
        console.error("Error fetching issues:", error);
        setIssueError(
          error instanceof Error ? error.message : "Failed to fetch issues"
        );
      }
    };

    fetchIssuesForSprint();
  }, [selectedSprint?.id]);

  const createSprint = async () => {
    if (
      !projectId ||
      !newSprint.name ||
      !newSprint.startDate ||
      !newSprint.endDate
    )
      return;

    try {
      const response = await fetch("/api/projects/sprints/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, ...newSprint }),
      });

      if (!response.ok) throw new Error("Failed to create sprint");

      const createdSprint = await response.json();

      setSprints((prevSprints) => [
        ...prevSprints,
        { ...createdSprint, issues: [] },
      ]);

      setNewSprint({ name: "", startDate: "", endDate: "" });
      setIsCreateSprintDialogOpen(false);
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  const createIssue = async () => {
    if (!selectedSprint || !newIssue.title || !newIssue.assignee) return;

    try {
      const response = await fetch("/api/projects/sprints/issues/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sprintId: selectedSprint.id,
          ...newIssue,
          status: "todo",
        }),
      });

      if (!response.ok) throw new Error("Failed to create issue");

      const createdIssue = await response.json();

      const updatedIssues = [...(selectedSprint.issues || []), createdIssue];

      // Replace selectedSprint with the updated array
      const updatedSprint = {
        ...selectedSprint,
        issues: updatedIssues,
      };

      // Update both `selectedSprint` and `sprints`
      setSprints((prevSprints) =>
        prevSprints.map((sprint) =>
          sprint.id === selectedSprint.id ? updatedSprint : sprint
        )
      );

      // Update `selectedSprint` to ensure it reflects the latest state
      setSelectedSprint(updatedSprint);
      setNewIssue({
        title: "",
        description: "",
        assignee: "",
        priority: "medium",
      });
      setIsCreateIssueDialogOpen(false);
      setDummyState((prev) => !prev);
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  };

  const handleStatusChange = async (
    issueId: string,
    newStatus: Issue["status"]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Your API call to update issue status
      const response = await fetch("/api/projects/sprints/issues/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issueId,
          status: newStatus.toUpperCase().replace("-", "_"),
        }),
      });

      console.log(await response.json());

      // Update sprints state
      // Create a new array of issues with the updated status
      const updatedIssues = selectedSprint?.issues.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      );

      // Create a new `selectedSprint` object with the updated issues array
      const updatedSprint = {
        ...selectedSprint,
        issues: updatedIssues,
      };

      setSelectedSprint(updatedSprint);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update issue status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollaborator = async (memberId: string) => {
    const response = await fetch("/api/projects/add_collab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: memberId,
        projectId: projectId,
      }),
    });
    const id = parseInt(memberId);
    const { username, email } = await response.json();
    setcollaborators((prevCollaborators) => [
      ...prevCollaborators,
      { id, username, email },
    ]);
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
      <div className="flex flex-row justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        <Button onClick={() => setIsAddCollaboratorModalOpen(true)}>
          Add Collaborators
        </Button>
      </div>

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
                  <Label>Sprint Name</Label>
                  <Input
                    value={newSprint.name}
                    onChange={(e) =>
                      setNewSprint({ ...newSprint, name: e.target.value })
                    }
                  />
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
                          priority: priority as Issue["priority"],
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
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          {collaborators.length > 0 ? (
            <ul className="space-y-2">
              {collaborators.map((collaborator) => (
                <li
                  key={collaborator.id}
                  className="px-4 py-2 border rounded-md shadow-sm"
                >
                  <p className="font-semibold">{collaborator.username}</p>
                  <p className="text-sm text-gray-500">{collaborator.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No collaborators found.</p>
          )}
        </CardContent>
      </Card>

      {selectedSprint && (
        <KanbanBoard
          issues={selectedSprint.issues}
          onStatusChange={handleStatusChange}
          isLoading={isLoading}
          error={error}
        />
      )}

      <AddCollaboratorModal
        open={isAddCollaboratorModalOpen}
        onClose={() => setIsAddCollaboratorModalOpen(false)}
        onAddCollaborator={handleAddCollaborator}
        prId={projectId || ""}
      />
    </div>
  );
};

export default ProjectSprintPage;
