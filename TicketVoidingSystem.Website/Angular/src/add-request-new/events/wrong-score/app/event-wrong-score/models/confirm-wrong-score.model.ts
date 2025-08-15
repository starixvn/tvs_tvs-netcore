import { FilterModel } from "../../../../../component/filter/filter.model";
import { IssueTypes } from "../../../../../component/filter/issue-types.model";
import { InfoSiteDBDownModel } from "../../../../../component/info-site-db-down/info-site-db-down.model";
import { LogInfoRelatedEvent } from "../../../../../component/log-info-related-event/log-info-related-event.model";
import { WrongScoreModel } from "../../../../../models/event-wrong-score.model";

export interface UpdateConfirmInfoArgs {
  isEdit: boolean;
  userId: number;
  requestId: number;
  requestedBy: string;
  issueTypes: IssueTypes;
  filter: FilterModel;
  actionIdOfFirstTimeAccess: string;
  relatedEvents: LogInfoRelatedEvent[];
  mainEvent: LogInfoRelatedEvent;
  wrongScoreModels: WrongScoreModel[];
  infoSiteDBDownModel: InfoSiteDBDownModel;
} 