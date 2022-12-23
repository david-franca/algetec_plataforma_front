export type Role = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type RoleCreate = Pick<Role, 'name'>;

export type RoleUpdate = Pick<Role, 'id' | 'name'>;
