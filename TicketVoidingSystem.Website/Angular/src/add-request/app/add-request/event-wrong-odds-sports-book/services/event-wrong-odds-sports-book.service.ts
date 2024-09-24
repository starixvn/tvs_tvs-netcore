import { Injectable } from "@angular/core";
import * as moment from 'moment-timezone';
import { DateTimeFormat } from "../../../../../utility/constants/config";
import { WrongOddsSportsBookModel } from "../../models/event-wrong-odds-sports-book.model";
import { FilterOddsTypeConstant, FilterWrongOddsSportsBookModel } from "../models/filter-wrong-odds-sports-book.model";
import { WrongOddsSportsBookGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoWrongOddsSportsBook } from "../models/log-info-wrong-odds-sports-book.model";

@Injectable({
  providedIn: 'root'
})

export class EventWrongOddsSportsBookService {
  initDefaultFilter(loginfoEvent: LogInfoWrongOddsSportsBook): void {
    const currentMoment = moment.utc().tz('America/Caracas');
    loginfoEvent.filterWrongOddsSportsBook = new FilterWrongOddsSportsBookModel();
    loginfoEvent.filterWrongOddsSportsBook.filterOddsType = FilterOddsTypeConstant.VALUE;
    loginfoEvent.filterWrongOddsSportsBook.fromDateTime = moment.utc().tz('America/Caracas').format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    loginfoEvent.filterWrongOddsSportsBook.toDateTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  initDefaultLogInfoWrongOddsSportsBook(): LogInfoWrongOddsSportsBook {
    const event = new LogInfoWrongOddsSportsBook();
    this.initDefaultFilter(event);

    return event;
  }

  public getWrongOddsSportsBookModel(logInfoWrongOddsSportsBook: LogInfoWrongOddsSportsBook, subIssueTypeId: string): WrongOddsSportsBookModel {
    const model = new WrongOddsSportsBookModel();
    model.matchId = logInfoWrongOddsSportsBook.matchId;
    model.logInfoDetail = logInfoWrongOddsSportsBook.logInfoDetail;
    model.subIssueTypeId = Number(subIssueTypeId);
    model.filterFromTransTime = logInfoWrongOddsSportsBook.filterWrongOddsSportsBook.fromDateTime;
    model.filterToTransTime = logInfoWrongOddsSportsBook.filterWrongOddsSportsBook.toDateTime;
    model.liveIndicator = logInfoWrongOddsSportsBook.filterWrongOddsSportsBook.liveIndicator;
    model.filterOddsType = logInfoWrongOddsSportsBook.filterWrongOddsSportsBook.filterOddsType;
    model.correctOdds = logInfoWrongOddsSportsBook.filterWrongOddsSportsBook.correctOdds;

    if (logInfoWrongOddsSportsBook.filterWrongOddsSportsBook.filterOddsType === FilterOddsTypeConstant.VALUE) {
      model.oddsValue = logInfoWrongOddsSportsBook.filterWrongOddsSportsBook.oddsValue;
    } else {
      model.fromOdds = logInfoWrongOddsSportsBook.filterWrongOddsSportsBook.fromOdds;
      model.toOdds = logInfoWrongOddsSportsBook.filterWrongOddsSportsBook.toOdds;
    }

    return model;
  }

  assignModelsToEvents(inputModels: WrongOddsSportsBookModel): LogInfoWrongOddsSportsBook {
    const event = new LogInfoWrongOddsSportsBook();
    event.matchId = inputModels.matchId;
    event.logInfoDetail = inputModels.logInfoDetail;
    event.filterWrongOddsSportsBook = {
      fromDateTime: inputModels.filterFromTransTime,
      toDateTime: inputModels.filterToTransTime,
      filterOddsType: inputModels.filterOddsType,
      oddsValue: inputModels.oddsValue,
      fromOdds: inputModels.fromOdds,
      toOdds: inputModels.toOdds,
      correctOdds: inputModels.correctOdds,
      liveIndicator: inputModels.liveIndicator
    } as FilterWrongOddsSportsBookModel;

    return event;
  }

  getWrongOddsSportsBookGetLogInfoModel(subIssueTypeId: number, logInfo: LogInfoWrongOddsSportsBook): WrongOddsSportsBookGetLogInfoQuery {
    const model = new WrongOddsSportsBookGetLogInfoQuery();
    model.matchId = logInfo.matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.filterFromTransTime = logInfo.filterWrongOddsSportsBook.fromDateTime;
    model.filterToTransTime = logInfo.filterWrongOddsSportsBook.toDateTime;
    model.betTeamsResult = logInfo.betTeamsResult;
    model.correctOdds = logInfo.filterWrongOddsSportsBook.correctOdds;
    model.filterOddsType = logInfo.filterWrongOddsSportsBook.filterOddsType;
    if (logInfo.filterWrongOddsSportsBook.filterOddsType === FilterOddsTypeConstant.VALUE) {
      model.oddsValue = logInfo.filterWrongOddsSportsBook.oddsValue;
    } else {
      model.fromOdds = logInfo.filterWrongOddsSportsBook.fromOdds;
      model.toOdds = logInfo.filterWrongOddsSportsBook.toOdds;
    }
    return model;
  }
}