import { Issue } from "../types";
import { IssueCard } from "./IssueCard";

interface KanbanColumnProps {
  status: Issue["status"];
  issues: Issue[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, issue: Issue) => void;
}

export const KanbanColumn = ({
  status,
  issues,
  onDragOver,
  onDrop,
  onDragStart,
}: KanbanColumnProps) => (
  <div
    className="bg-gray-100 p-4 rounded-lg min-h-[400px] text-black"
    onDragOver={onDragOver}
    onDrop={onDrop}
  >
    <h3 className="font-semibold mb-4 capitalize">
      {status.replace("_", " ")}
    </h3>
    {issues.map((issue) => (
      <IssueCard
        key={issue.id}
        issue={issue}
        onDragStart={(e) => onDragStart(e, issue)}
      />
    ))}
  </div>
);