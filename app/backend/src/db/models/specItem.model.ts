export type ISpecItem = {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  category_id: number;
  quantity: number;
  unit_of_measure_id: number;
  created_at: Date;
  updated_at: Date;
};

export type InsertSpecItem = Omit<
  ISpecItem,
  "id" | "created_at" | "updated_at"
>;
