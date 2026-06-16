export const ProjectStatus = ["draft", "sourcing", "quoted", "closed"] as const;

export type TProjectStatus = (typeof ProjectStatus)[number];

export type IProjectDb = {
  id: number;
  project_name: string;
  client_name: string;
  project_status: TProjectStatus;
  created_at: Date;
  updated_at: Date;
};

export type InsertProject = Omit<
  IProjectDb,
  "id" | "created_at" | "created_at" | "updated_at"
>;
