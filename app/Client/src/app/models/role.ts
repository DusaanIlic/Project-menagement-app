import {RoleMember} from "./role-member";

export interface Role {
  id: number;
  name: string;
  isDefault: boolean;
  isFallback: boolean;
  members: RoleMember[];
}
