import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TvDetectionType } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { TvDetectionModel } from './tv-detection.model';

@Injectable()
export class TvDetectionService {
  private readonly SERVICE_ACCEPT_TIME = 'service-accept-time';
  private readonly ACTUAL_TIME = 'actual-time';
  private readonly MINUTE_INPUT = 'minute-input';
  private readonly SECOND_INPUT = 'second-input';

  isValid(model: TvDetectionModel, tooltip: Tooltip): boolean {
    return model.tvDetectionValue === TvDetectionType.NONE
      || (this.isValidityTime(model.serviceAcceptTime, this.SERVICE_ACCEPT_TIME, tooltip)
      && this.isValidityTime(model.actualTime, this.ACTUAL_TIME, tooltip)
      && this.isValiditySecond(model.secondOffset, tooltip)
      && this.isValidityMinute(model.minuteOffset, tooltip));
  }

  isValiditySecond(second: string, tooltip: Tooltip): boolean {
    const MAXIMUM_SECOND = 59;
    if (!StaticService.isCorrectRegexOnlyNumber(second) || (Number(second) < 0 || Number(second) > MAXIMUM_SECOND)) {
      tooltip.display(this.SECOND_INPUT, 'Invalid second');
      return false;
    }
    tooltip.hide();

    return true;
  }

  isValidityMinute(minute: string, tooltip: Tooltip): boolean {
    if (!StaticService.isCorrectRegexOnlyNumber(minute) || Number(minute) < 0) {
      tooltip.display(this.MINUTE_INPUT, 'Invalid minute');
      return false;
    }
    tooltip.hide();

    return true;
  }

  isValidityTime(time: string, className: string, tooltip: Tooltip): boolean {
    const timeMoment = moment(time?.trim(), DateTimeFormat.SIMPLE_TIME_FORMAT, true);
    if (!timeMoment.isValid()) {
      tooltip.display(className, `Invalid time format, The correct format is ${DateTimeFormat.SIMPLE_TIME_FORMAT}`);
      return false;
    }
    tooltip.hide();

    return true;
  }

  getActualTime(model: TvDetectionModel, tooltip: Tooltip): string {
    const SECONDS_IN_A_MINUTE = 60;
    if (this.isValidityTime(model.serviceAcceptTime, this.SERVICE_ACCEPT_TIME, tooltip)
      && this.isValiditySecond(model.secondOffset, tooltip)
      && this.isValidityMinute(model.minuteOffset, tooltip)) {
        const numberOfSeconds = Number(model.secondOffset) + Number(model.minuteOffset) * SECONDS_IN_A_MINUTE;
        model.actualTime = model.tvDetectionValue === TvDetectionType.SLOW
          ? this.subtractSeconds(model.serviceAcceptTime, numberOfSeconds)
          : this.addSeconds(model.serviceAcceptTime, numberOfSeconds);

        return model.actualTime;
      }

      return null;
  }

  addSeconds(serviceAcceptTime: string, numberOfSeconds: number): string {
    return moment(serviceAcceptTime, DateTimeFormat.SIMPLE_TIME_FORMAT)
    .add(numberOfSeconds, 'seconds')
    .format(DateTimeFormat.SIMPLE_TIME_FORMAT);
  }

  subtractSeconds(serviceAcceptTime: string, numberOfSeconds: number): string {
    return moment(serviceAcceptTime, DateTimeFormat.SIMPLE_TIME_FORMAT)
    .subtract(numberOfSeconds, 'seconds')
    .format(DateTimeFormat.SIMPLE_TIME_FORMAT);
  }
}