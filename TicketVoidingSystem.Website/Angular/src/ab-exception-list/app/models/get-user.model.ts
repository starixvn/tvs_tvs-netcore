import { UserModel } from "./user.model";

export class GetUserModel {
  users: UserModel[];
  invalidUsername: string;
}