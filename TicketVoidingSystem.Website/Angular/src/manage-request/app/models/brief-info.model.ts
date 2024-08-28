import { UserVoidMessage } from "../ticket-list/request-info/request-info.model";

export class BriefInfo {
  matchId: number;
  affectedLicenseeNames: string;
  cancelCashOutLicenseesNames: string;
  chinaViewLicenseesNames: string;
  userVoidMessages: UserVoidMessage[];
}