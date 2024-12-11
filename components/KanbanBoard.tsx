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
    // Prevent dragging if loading
    if (isLoading) {
      e.preventDefault();
      return;
    }
    e.dataTransfer?.setData("text/plain", JSON.stringify(issue));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    // Prevent drag if loading
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
    // Prevent drop if loading
    if (isLoading) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const draggedIssueData = e.dataTransfer?.getData("text/plain");
    
    if (!draggedIssueData) return;

    try {
      const draggedIssue = JSON.parse(draggedIssueData);
      
      // Ensure the issue actually needs a status change
      if (draggedIssue.status !== targetStatus) {
        onStatusChange(draggedIssue.id, targetStatus);
      }
    } catch (error) {
      console.error("Error parsing dragged issue", error);
    }
  };

  const renderKanbanColumn = (status: Issue["status"]) => {
    const columnIssues = issues.filter((issue) => issue.status.toLowerCase() === status);

    return (
      <div
        className={`
          bg-gray-100 p-4 rounded-lg min-h-[400px] text-black 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <h3 className="font-semibold mb-4 capitalize">
          {status.replace("-", " ")}
        </h3>
        {columnIssues.map((issue) => (
          <Card
            key={issue.id}
            className={`
              mb-2 
              ${isLoading ? 'cursor-not-allowed' : 'cursor-move'}
            `}
            draggable={!isLoading}
            onDragStart={(e) => handleDragStart(e, issue)}
          > 
            <CardContent className="p-4">
              <p className="font-medium">{issue.title}</p>
              <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm mr-2">{'@' + issue.assigneeUsername}</span>
                <Badge
                  variant={
                    issue.priority.toLowerCase() === "high"
                      ? "destructive"
                      : issue.priority.toLowerCase() === "medium"
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
    <div className="grid grid-cols-4 gap-4">
      {renderKanbanColumn("todo")}
      {renderKanbanColumn("in_progress")}
      {renderKanbanColumn("review")}
      {renderKanbanColumn("done")}
    </div>
  );
};

export default KanbanBoard;