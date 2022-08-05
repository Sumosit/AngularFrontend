import {RoleInterface} from "@shared/interfaces/role-interface";

export interface UserInterface {
  id: number | undefined,
  username: string | undefined,
  role: RoleInterface[] | undefined
}
