export interface ICategoryDb {
  id: number;
  name: string;
}

export type InsertCategory = Omit<ICategoryDb, "id">;
