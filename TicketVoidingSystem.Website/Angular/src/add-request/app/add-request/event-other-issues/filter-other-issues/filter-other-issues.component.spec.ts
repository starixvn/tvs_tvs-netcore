import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { ValidationService } from '../services/validation.service';
import { FilterOtherIssuesComponent } from './filter-other-issues.component';

describe('FilterOtherIssuesComponent', () => {
  let mockComponent: FilterOtherIssuesComponent;
  let validationService: ValidationService;

  beforeEach(() => {
    validationService = new ValidationService(null);
    mockComponent = new FilterOtherIssuesComponent(null, validationService);
  });

  it('FilterOtherIssuesComponent init should match snapshot', async () => {
    expect(mockComponent).toMatchSnapshot();
  });

  it('isValidity should return result from #filterService.isValidity', async () => {
    [
      { isValidFromTime: true, isValidToTime: true, isFromBeforeToTime: true, expected: true },
      { isValidFromTime: true, isValidToTime: true, isFromBeforeToTime: false, expected: false },
      { isValidFromTime: true, isValidToTime: false, isFromBeforeToTime: true, expected: false },
      { isValidFromTime: true, isValidToTime: false, isFromBeforeToTime: false, expected: false },
      { isValidFromTime: false, isValidToTime: true, isFromBeforeToTime: true, expected: false },
      { isValidFromTime: false, isValidToTime: false, isFromBeforeToTime: false, expected: false }
    ].forEach((testCase) => {
      mockComponent.fromTimeComponent = new DateFullTimeNewComponent(null);
      mockComponent.toTimeComponent = new DateFullTimeNewComponent(null);
      mockComponent.fromTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(testCase.isValidFromTime);
      mockComponent.toTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(testCase.isValidToTime);
      validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockReturnValue(testCase.isFromBeforeToTime);

      const actual = mockComponent.isValidity();

      expect(actual).toBe(testCase.expected);
    });
  });

  it('changeFilter should emit changeFilterEvent', async () => {
    mockComponent.changeFilterEvent.emit = jest.fn();
    mockComponent.changeFilter();

    expect(mockComponent.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('emitRefreshEvent should emit refreshEvent', async () => {
    mockComponent.refreshEvent.emit = jest.fn();
    mockComponent.emitRefreshEvent();

    expect(mockComponent.refreshEvent.emit).toHaveBeenCalledTimes(1);
  });
});
