export interface Issue {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "review" | "done";
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
  id: number;
  username: string;
  email: string;
};