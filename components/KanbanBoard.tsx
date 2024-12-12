import React, { DragEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  assigneeUsername: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "review" | "done";
}

interface KanbanBoardProps {
  issues: Issue[];
  onStatusChange: (issueId: string, newStatus: Issue["status"]) => void;
  error?: string | null;
  isLoading?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  issues,
  onStatusChange,
  error = null,
  isLoading = false,
}) => {
  const handleDragStart = (e: DragEvent<HTMLDivElement>, issue: Issue) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    e.dataTransfer?.setData("text/plain", JSON.stringify(issue));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetStatus: Issue["status"]
  ) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const draggedIssueData = e.dataTransfer?.getData("text/plain");
    if (!draggedIssueData) return;

    try {
      const draggedIssue = JSON.parse(draggedIssueData);
      if (draggedIssue.status !== targetStatus) {
        onStatusChange(draggedIssue.id, targetStatus);
      }
    } catch (error) {
      console.error("Error parsing dragged issue", error);
    }
  };

  const columns: Issue["status"][] = ["todo", "in_progress", "review", "done"];

  const renderKanbanColumn = (status: Issue["status"]) => {
    const columnIssues = issues.filter(
      (issue) => issue.status.toLowerCase() === status
    );

    return (
      <div
        key={status}
        className={`
          bg-gray-100 p-4 rounded-lg min-h-[200px] w-full text-black
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          md:min-h-[400px]
        `}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <h3 className="font-semibold mb-4 capitalize">
          {status.replace("_", " ")}
        </h3>
        {columnIssues.map((issue) => (
          <Card
            key={issue.id}
            className={`
            mb-2
            ${isLoading ? "cursor-not-allowed" : "cursor-move"}
            touch-manipulation
            hover:shadow-md
            transition-shadow
            max-w-full
          `}
            draggable={!isLoading}
            onDragStart={(e) => handleDragStart(e, issue)}
          >
            <CardContent className="p-3">
              <p
                className="font-medium text-sm truncate mb-1"
                title={issue.title}
              >
                {issue.title}
              </p>
              <p
                className="text-sm text-gray-600 break-words whitespace-pre-wrap mb-2"
                title={issue.description}
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: "3",
                  overflow: "hidden",
                  minHeight: "3rem",
                  maxHeight: "4.5rem",
                }}
              >
                {issue.description}
              </p>
              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                <span
                  className="text-xs text-gray-500 truncate max-w-[120px]"
                  title={"@" + issue.assigneeUsername}
                >
                  {"@" + issue.assigneeUsername}
                </span>
                <Badge
                  variant={
                    issue.priority.toLowerCase() === "high"
                      ? "destructive"
                      : issue.priority.toLowerCase() === "medium"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
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

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Updating issue status...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {columns.map(renderKanbanColumn)}
      </div>

      {/* Mobile View - Vertical Layout */}
      <div className="md:hidden space-y-4 pb-4">
        {columns.map(renderKanbanColumn)}
      </div>
    </div>
  );
};

export default KanbanBoard;
