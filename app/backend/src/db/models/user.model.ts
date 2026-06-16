export interface IUserDb {
  id: number;
  username: string;
  password_hash: string;
  is_active?: boolean;
  deleted_at?: Date;
  created_at: Date;
}

export type InsertUser = Omit<
  IUserDb,
  "id" | "is_active" | "deleted_at" | "created_at"
>;
