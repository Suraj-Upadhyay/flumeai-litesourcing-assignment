export interface ISupplierDb {
  id: number;
  name: string;
  country: string;
  website: string | null;
}

export type InsertSupplier = Omit<ISupplierDb, "id">;
