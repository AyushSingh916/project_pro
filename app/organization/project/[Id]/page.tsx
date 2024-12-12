"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import KanbanBoard from "@/components/KanbanBoard";
import AddCollaboratorModal from "@/components/Modals/addcollabarators";
import { Issue, Sprint } from "@/components/types";
import Collaborators from "@/components/collabarators";
import SprintSelector from "@/components/SprintSelector";
import CreateIssueDialog from "@/components/CreateIssueDialog";

interface ProjectSprintPageProps {
  params: Promise<{ Id: string }>;
}

type NewIssue = {
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
};

const ProjectSprintPage: React.FC<ProjectSprintPageProps> = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [projectId, setProjectId] = useState<string | undefined>();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [isCreateIssueDialogOpen, setIsCreateIssueDialogOpen] =
    useState<boolean>(false);
  const [isAddCollaboratorModalOpen, setIsAddCollaboratorModalOpen] =
    useState<boolean>(false);
  const [newIssue, setNewIssue] = useState<NewIssue>({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<any[]>([]);

  // Initialize projectId from params
  useEffect(() => {
    params.then((resolvedParams) => {
      setProjectId(resolvedParams.Id);
    });
  }, [params]);

  // Fetch initial project data
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;

      try {
        const res = await fetch("/api/projects/findall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });

        if (!res.ok) throw new Error("Failed to fetch project data");

        const data = await res.json();
        setSprints(data.sprints || []);
        setCollaborators(data.collab || []);
        setSelectedSprint(data.sprints?.[0] || null);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch project data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // Fetch issues for selected sprint
  useEffect(() => {
    const fetchIssuesForSprint = async () => {
      if (!selectedSprint?.id) return;

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/projects/sprints/issues/find/?sprintId=${selectedSprint.id}`,
          { method: "GET" }
        );

        if (!response.ok) throw new Error("Failed to fetch issues");

        const data = await response.json();

        // Update both sprints and selectedSprint with the new issues
        setSprints((prevSprints) =>
          prevSprints.map((sprint) =>
            sprint.id === selectedSprint.id
              ? { ...sprint, issues: data.issues }
              : sprint
          )
        );
        setSelectedSprint((prev) =>
          prev ? { ...prev, issues: data.issues } : null
        );
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssuesForSprint();
  }, [selectedSprint?.id]);

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

      // Update both sprints and selectedSprint
      const updatedSprint = { ...selectedSprint, issues: updatedIssues };
      setSprints((prevSprints) =>
        prevSprints.map((sprint) =>
          sprint.id === selectedSprint.id ? updatedSprint : sprint
        )
      );
      setSelectedSprint(updatedSprint);

      // Reset form
      setNewIssue({
        title: "",
        description: "",
        assignee: "",
        priority: "medium",
      });
      setIsCreateIssueDialogOpen(false);
    } catch (error) {
      console.error("Error creating issue:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create issue"
      );
    }
  };

  const handleStatusChange = async (
    issueId: string,
    newStatus: Issue["status"]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects/sprints/issues/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId,
          status: newStatus.toUpperCase().replace("-", "_"),
        }),
      });

      if (!response.ok) throw new Error("Failed to update issue status");

      // const data = await response.json();

      if (!selectedSprint) return;

      const updatedIssues =
        selectedSprint.issues?.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        ) || [];

      // Update both sprints and selectedSprint
      const updatedSprint = { ...selectedSprint, issues: updatedIssues };
      setSprints((prevSprints) =>
        prevSprints.map((sprint) =>
          sprint.id === selectedSprint.id ? updatedSprint : sprint
        )
      );
      setSelectedSprint(updatedSprint);
    } catch (error) {
      console.error("Error updating issue status:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update issue status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  console.log(projectId)

  const handleAddCollaborator = async (memberId: string) => {
    try {
      console.log(projectId, memberId)
      const response = await fetch("/api/projects/add_collab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: memberId,
          projectId: projectId,
        }),
      });

      console.log(projectId, memberId)

      if (!response.ok) throw new Error("Failed to add collaborator");

      const data = await response.json();
      const id = parseInt(memberId);
      const { username, email } = data;

      setCollaborators((prev) => [...prev, { id, username, email }]);
      setIsAddCollaboratorModalOpen(false);
    } catch (error) {
      console.error("Error adding collaborator:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add collaborator"
      );
    }
  };

  const handleUpdateSprint = (updatedSprint: Sprint) => {
    setSelectedSprint(updatedSprint);
  };

  const handleUpdateSprints = (updatedSprints: Sprint[]) => {
    setSprints(updatedSprints);
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
          Back to Organization
        </Button>

        <Button onClick={() => setIsAddCollaboratorModalOpen(true)}>
          Add Collaborators
        </Button>
      </div>

      <Card className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-auto">
          <SprintSelector
            sprints={sprints}
            selectedSprint={selectedSprint}
            isLoading={isLoading}
            projectId={projectId}
            handleUpdateSprint={handleUpdateSprint}
            handleUpdateSprints={handleUpdateSprints}
          />
        </div>
        <div className="w-full sm:w-auto">
          <CreateIssueDialog
            isOpen={isCreateIssueDialogOpen}
            setIsCreateIssueDialogOpen={setIsCreateIssueDialogOpen}
            newIssue={newIssue}
            setNewIssue={setNewIssue}
            createIssue={createIssue}
            collaborators={collaborators}
          />
        </div>
      </div>
    </Card>

      <Collaborators collabarators={collaborators} />

      {selectedSprint && (
        <KanbanBoard
          issues={selectedSprint.issues || []}
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
