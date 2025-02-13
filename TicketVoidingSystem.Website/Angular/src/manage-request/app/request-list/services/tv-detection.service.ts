import _ from 'lodash';
import { TvDetection, TvDetectionType, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { RequestInfoForCopy } from '../../../../utility/models/copy-request-info.query';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import moment from 'moment';
import { StaticService } from '../../../../utility/services/static.service';

export class TvDetectionService {
  static getTvDetectionClass(tvDetectionValue: number) {
    switch (tvDetectionValue) {
      case TvDetectionType.SLOW:
        return 'slow-color';
      case TvDetectionType.FAST:
        return 'fast-color';
      default:
        return '';
    }
  }

  static getProviderInfo(requestInfo: RequestInfoForCopy): string {
    const issueTypeHasTvDetection = [IssueTypeConstant.DANGER_ACCEPTED, IssueTypeConstant.RED_CARD, IssueTypeConstant.WRONG_SCORE];

    const tvDetectionInfo = issueTypeHasTvDetection.includes(requestInfo.issueTypeId.toString()) && requestInfo.tvDetectionValue === TvDetectionType.FAST
       ? `, TV fast ${requestInfo.minuteOffset}m${requestInfo.secondOffset}s`
       : requestInfo.tvDetectionValue === TvDetectionType.SLOW ? `, TV slow ${requestInfo.minuteOffset}m${requestInfo.secondOffset}s` : '';

    return `${requestInfo.provider}${tvDetectionInfo}`
  }
  
  static getTvDetection(requestInfo: RequestInfoForCopy){
    if(!StaticService.isDangerAccepted(requestInfo.issueTypeId) && !StaticService.isRedCard(requestInfo.issueTypeId)
      && !(StaticService.isWrongScore(requestInfo.issueTypeId) && requestInfo.filterBy === TVSRequestFilterBy.CHECK_TIME)) {
      return '';
    }
    
    return `\nTV Detection: ${requestInfo.tvDetectionValue === TvDetectionType.NONE ? TvDetection.OFF : TvDetection.ON}\n`
      + this.getTvDetectionTime(requestInfo)
      + ` This check time start void (${requestInfo.minAcceptType})`;
  }

  private static getTvDetectionTime(requestInfo: RequestInfoForCopy){
    return requestInfo.tvDetectionValue === TvDetectionType.NONE ? this.getTvDetectionTimeOff(requestInfo) : this.getTvDetectionTimeOn(requestInfo);
  }

  private static getTvDetectionTimeOff(requestInfo: RequestInfoForCopy){
    const inputtedFromTime = moment(requestInfo.filterFromTransTime).format("hh:mm:ss")
    return `${inputtedFromTime}(Provider) + ${requestInfo.minAllowanceTime}s `
      + `= ${this.addSecondsToTime(inputtedFromTime, 0, requestInfo.minAllowanceTime)}`;
  }

  private static getTvDetectionTimeOn(requestInfo: RequestInfoForCopy){
    let time = Number(requestInfo.minuteOffset) !== 0 ? `${requestInfo.minuteOffset}m${requestInfo.secondOffset}s`: `${requestInfo.secondOffset}s`;
    const serviceAcceptTime = moment(requestInfo.serviceAcceptTime, "hh:mm:ss A").format("hh:mm:ss");;

    if(requestInfo.tvDetectionValue === TvDetectionType.FAST){
      const sumTimeError = this.addSecondsToTime(serviceAcceptTime, Number(requestInfo.minuteOffset), Number(requestInfo.secondOffset));
      const sumAllowanceTime = this.addSecondsToTime(sumTimeError, 0, requestInfo.minAllowanceTime);
      return `${serviceAcceptTime}(TV) + ${time}(Fast) = ${sumTimeError} + ${requestInfo.minAllowanceTime}s = ${sumAllowanceTime}`;
    }

    const subTimeError = this.addSecondsToTime(serviceAcceptTime, -Number(requestInfo.minuteOffset), -Number(requestInfo.secondOffset));
    const sumAllowanceTime = this.addSecondsToTime(subTimeError, 0, requestInfo.minAllowanceTime);

    return `${serviceAcceptTime}(TV) - ${time}(Slow) = ${subTimeError} + ${requestInfo.minAllowanceTime}s = ${sumAllowanceTime}`;
  }

  private static addSecondsToTime(time: string, minutesToAdd: number, secondsToAdd: number): string {
    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // Create a Date object with the time
    const date = new Date();
    date.setHours(hours, minutes + minutesToAdd, seconds + secondsToAdd);

    // Format the result back to hh:mm:ss
    return date.toTimeString().split(' ')[0];
  }
}