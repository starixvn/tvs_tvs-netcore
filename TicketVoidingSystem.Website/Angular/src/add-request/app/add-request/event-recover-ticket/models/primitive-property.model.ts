import { PermissionAddRequest } from "../../models/permission-add-request.model";

export class PrimitiveProperty {
  isBlockBetIds = false;
  isMatchIdValid = false;
  transInfoJson?: string;
  unMarkTransIds: string;
  permission: PermissionAddRequest;
}
