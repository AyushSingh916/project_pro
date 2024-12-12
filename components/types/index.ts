export interface Issue {
  id: string;
  title: string;
  description: string;
  assigneeUsername: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "review" | "done";
}

export interface NewSprint {
  name: string;
  startDate: string;
  endDate: string;
}

export interface Sprint {
  id?: number;
  name?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  issues?: Issue[];
}


export type Collaborator = {
  id: string;
  username: string;
  email: string;
};