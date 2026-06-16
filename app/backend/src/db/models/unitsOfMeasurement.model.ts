export interface IUnitOfMeasureDb {
  id: number;
  name: string;
}

export type InsertUnitOfMeasure = Omit<IUnitOfMeasureDb, "id">;
