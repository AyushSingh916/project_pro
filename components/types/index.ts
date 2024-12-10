export interface Issue {
  id: string;
  title: string;
  description: string;
  assigneeUsername: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  createdAt: Date;
  updatedAt: Date;
}

export interface NewSprint {
  name: string;
  startDate: string;
  endDate: string;
}

export interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  issues: Issue[];
}
