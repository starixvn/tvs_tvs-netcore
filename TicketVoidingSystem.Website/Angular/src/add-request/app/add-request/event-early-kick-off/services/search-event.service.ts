import { Injectable } from '@angular/core';
import _ from 'lodash';
import { MatchType } from '../../../../../utility/constants/config';
import { ChildMatchModel } from '../../models/related-event.model';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { LogInfoService } from './log-info.service';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class SearchEventService {
  constructor(
    private readonly logInfoService: LogInfoService,
    private readonly relatedEventService: RelatedEventService,
    private readonly validationService: ValidationService,
    private readonly checkPermissionService: CheckAddPermissionService
  ) { }

  public async searchEvents(arg: SaveRequestArg, newestRelatedEvents: ChildMatchModel[]): Promise<boolean> {
    this.logInfoService.resetLogInfoOfEvent(arg.allEvents);
    arg.allEvents.filter(x => !x.isMainMatch).forEach(x => {
      x.isCollapse = true;
    })

    if (!this.validationService.validateCommonData(arg.eventLeagueComponent, arg.kickOffTimeComponent)) {
      return false;
    }

    arg.primitiveProps.isShowLogInfoEvents = false;
    await this.getLogInfoForAllEvents(arg, newestRelatedEvents);
    arg.allEvents = _.orderBy(_.uniqBy(arg.allEvents, x => x.matchId), ['matchCode'], ['asc']);

    if (!this.checkPermissionService.isAccountHasAddRequestPermission(arg.filter.action,
      arg.allEvents.some(x => x.isHasInstantlySettledTicket), arg.allEvents.some(x => x.isHasSettledTicket), arg.permission)) {
      return false;
    }

    arg.primitiveProps.isShowLogInfoEvents = true;
    return true;
  }

  public async getLogInfoForAllEvents(arg: SaveRequestArg, newestRelatedEvents: ChildMatchModel[]): Promise<void> {
    this.addNewestChildEventsToAllSelectedEvents(arg, newestRelatedEvents);
    const getLogInfoResult = await this.logInfoService.getLogInfo(arg.allEvents, arg.isEdit, arg.requestId, arg.filter);
    this.logInfoService.assignResultLogInfoToEvents(arg.allEvents, getLogInfoResult.getLogInfoModels);

    arg.primitiveProps.transInfoAddRequestModel = getLogInfoResult.transInfoAddRequestModel;
  }

  private addNewestChildEventsToAllSelectedEvents(arg: SaveRequestArg, newestRelatedEvents: ChildMatchModel[]): void {
    const newChildEvents = newestRelatedEvents.filter(x => !arg.allEvents.some(y => y.matchId === x.matchId) && x.matchType === MatchType.LINK);
    const newEvents = this.relatedEventService.mapChildMatchesToEvents(newChildEvents, arg.mainEvent);
    arg.allEvents.push(...newEvents);
  }
}