import {UserInterface} from "@shared/interfaces/user-interface";

export interface MessageInterface {
  id: number,
  user: UserInterface | undefined,
  message: string,
  imgIds: string[] | any
}
