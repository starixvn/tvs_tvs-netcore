
export class TicketListModal {
  open: boolean;
  minimize?: boolean;
  requestId: number;
  matchId: number;
  requestDetailId: number;
  //allMatchIdsInRequest: number[];

  tabInfoRequest: TabInfoRequest[] = [];
}

export class TabInfoRequest {
  id: number;
  isActive: boolean;
  matchId: number;
  requestDetailId: number;
  name: string;
}