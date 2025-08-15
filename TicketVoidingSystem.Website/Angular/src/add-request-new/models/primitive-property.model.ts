export class PrimitiveProperty {
  matchId: number;
  parentMatchId: number = null;

  requestId: number;
  sportType: number;
  userId: number;
  requestedBy: string;
  actionIdOfFirstTimeAccess: string;

  title: string;
  isEdit = false;
  showCopyInfoButtons = false;
  isCollapse = false;
  isDisabledSaveButton = false;
  isLoadingData = true;
}
