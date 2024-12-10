import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Issue } from "../types";

interface IssueCardProps {
  issue: Issue;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const IssueCard = ({ issue, onDragStart }: IssueCardProps) => (
  <Card
    className="mb-2 cursor-move"
    draggable
    onDragStart={onDragStart}
  >
    <CardContent className="p-4">
      <p className="font-medium">{issue.title}</p>
      <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
      <div className="flex items-center mt-2">
        <span className="text-sm mr-2">{issue.assigneeUsername}</span>
        <Badge
          variant={
            issue.priority === "HIGH"
              ? "destructive"
              : issue.priority === "MEDIUM"
              ? "default"
              : "secondary"
          }
        >
          {issue.priority.toLowerCase()}
        </Badge>
      </div>
    </CardContent>
  </Card>
);