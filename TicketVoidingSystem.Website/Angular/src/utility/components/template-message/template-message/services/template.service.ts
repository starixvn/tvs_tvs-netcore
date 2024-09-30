import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { MatchModel } from '../../../../models/match.model';
import { FormatDateTime } from '../template.const';
import { TemplateValue } from '../template.model';

@Injectable()
export class TemplateService {
  constructor() { }

  initializeTemplateValue(match: MatchModel): TemplateValue {
    return {
      sportType: {
        msgEnglish: match.sportTypeName,
        msgChineseTraditional: match.sportTypeNameTraditional,
        msgChineseSimplified: match.sportTypeNameSimplified,
        msgChineseNewSimplified: match.sportTypeNameNewSimplified
      },
      homeTeamName: {
        msgEnglish: match.homeName,
        msgChineseTraditional: match.homeNameTraditional,
        msgChineseSimplified: match.homeNameSimplified,
        msgChineseNewSimplified: match.homeNameNewSimplified
      },
      awayTeamName: {
        msgEnglish: match.awayName,
        msgChineseTraditional: match.awayNameTraditional,
        msgChineseSimplified: match.awayNameSimplified,
        msgChineseNewSimplified: match.awayNameNewSimplified
      },
      leagueName: {
        msgEnglish: match.leagueName,
        msgChineseTraditional: match.leagueNameTraditional,
        msgChineseSimplified: match.leagueNameSimplified,
        msgChineseNewSimplified: match.leagueNameNewSimplified
      },
      eventDate: moment(new Date(match.eventDate)).format(FormatDateTime.EVENT_DATE),
      sportTypeId: match.sportType,
      matchId: match.matchId,
      match: match,
      groupPHAffected: 0
    };
  }
}
