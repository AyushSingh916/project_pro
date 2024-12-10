import { Sprint, Issue } from "../types";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  sprint: Sprint;
  onIssueDrop: (issueId: string, targetStatus: Issue["status"]) => void;
}

export const KanbanBoard = ({ sprint, onIssueDrop }: KanbanBoardProps) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issue: Issue) => {
    e.dataTransfer?.setData("text/plain", issue.id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Issue["status"]) => {
    e.preventDefault();
    const issueId = e.dataTransfer?.getData("text/plain");
    if (issueId) {
      onIssueDrop(issueId, status);
    }
  };

  const statuses: Issue["status"][] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

  return (
    <div className="grid grid-cols-4 gap-4">
      {statuses.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          issues={sprint.issues.filter((issue) => issue.status === status)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
};