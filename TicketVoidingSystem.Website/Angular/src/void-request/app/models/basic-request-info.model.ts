
export class BasicRequestInfo {
  id: number;
  matchId: number;
  subIssueTypeId: number;
  wrongMarket?: string;
  actualMarket?: string;
  hdpValue?: string;
  isCheckedVar?: boolean;
  isMainMatch: boolean;
  //filterWithHdp?: FilterWithHdpModel;
  //FilterWrongOu?: FilterWrongOuModel;
}