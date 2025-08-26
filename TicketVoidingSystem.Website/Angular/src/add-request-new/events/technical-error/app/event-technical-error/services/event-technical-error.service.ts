import { Injectable } from "@angular/core";
import { TechnicalErrorModel } from "../../../../../models/event-technical-error.model";
import { FilterTechnicalErrorModel } from "../models/filter-technical-error.model";
import { TechnicalErrorGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoTechnicalError } from "../models/log-info-technical-error.model";

@Injectable()
export class EventTechnicalErrorService {

  public getTechnicalErrorGetLogInfoModel(subIssueTypeId: number, logInfo: LogInfoTechnicalError): TechnicalErrorGetLogInfoQuery {
    return this.createTechnicalErrorGetLogInfoQuery(logInfo, Number(subIssueTypeId));
  }

  public getTechnicalErrorModel(subIssueTypeId: number, logInfoEvent: LogInfoTechnicalError): TechnicalErrorModel {
    const model = new TechnicalErrorModel();
    model.filterFromTransTime = logInfoEvent.filterTechnicalErrorModel.fromDateTime;
    model.filterToTransTime = logInfoEvent.filterTechnicalErrorModel.toDateTime;
    model.matchId = logInfoEvent.matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.logInfoDetail = logInfoEvent.logInfoDetail;
    model.betTeamsResult = logInfoEvent.betTeamsResult;
    model.betTypeCount = logInfoEvent.betTypeCount;
    model.allBetTypesSelection = logInfoEvent.allBetTypesSelection;
    return model;
  }

  public assignModelsToEvents(inputModel: TechnicalErrorModel): LogInfoTechnicalError {
    const logInfo = new LogInfoTechnicalError();
    logInfo.matchId = inputModel.matchId;
    logInfo.logInfoDetail = inputModel.logInfoDetail;
    logInfo.filterTechnicalErrorModel = this.createFilterTechnicalErrorModel(inputModel);
    logInfo.betTypeCount = inputModel.betTypeCount;
    logInfo.betTeamsResult = inputModel.betTeamsResult;
    logInfo.allBetTypesSelection = inputModel.allBetTypesSelection;

    return logInfo;
  }

  private createFilterTechnicalErrorModel(inputModel: TechnicalErrorModel): FilterTechnicalErrorModel {
    const model = new FilterTechnicalErrorModel();
    model.fromDateTime = inputModel.filterFromTransTime;
    model.toDateTime = inputModel.filterToTransTime;

    return model;
  }

  private createTechnicalErrorGetLogInfoQuery(logInfo: LogInfoTechnicalError, subIssueTypeId: number): TechnicalErrorGetLogInfoQuery {
    const model = new TechnicalErrorGetLogInfoQuery();
    model.matchId = logInfo.matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.filterFromTransTime = logInfo.filterTechnicalErrorModel.fromDateTime;
    model.filterToTransTime = logInfo.filterTechnicalErrorModel.toDateTime;
    model.betTeamsResult = logInfo.betTeamsResult;
    return model;
  }
}