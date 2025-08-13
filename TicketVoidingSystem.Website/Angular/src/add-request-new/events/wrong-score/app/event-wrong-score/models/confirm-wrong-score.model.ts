import { InfoSiteDBDownModel } from "../../components/info-site-db-down/info-site-db-down.model";
import { LogInfoRelatedEvent } from "../../components/log-info-related-event/log-info-related-event.model";
import { FilterModel } from "../../filter/filter.model";
import { IssueTypes } from "../../filter/issue-types.model";
import { WrongScoreModel } from "../../models/event-wrong-score.model";

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