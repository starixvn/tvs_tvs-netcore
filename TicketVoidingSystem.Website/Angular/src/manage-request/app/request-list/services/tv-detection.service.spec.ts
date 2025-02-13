import { RequestInfoForCopy } from '../../../../utility/models/copy-request-info.query';
import { TvDetectionService } from './tv-detection.service';

describe('StaticService', () => {
  const minAcceptType = 'Pending Accept';
  it('#getTvDetection should return empty when issueType not support TvDetection', () => {
    // Arrange
    const requestInfo = { issueTypeId: 23 } as RequestInfoForCopy;

    // Action
    const result = TvDetectionService.getTvDetection(requestInfo);

    // Assert
    expect(result).toEqual('');
  });

  it('#getTvDetection should return expected when TvDetection Off', () => {
    // Arrange
    const requestInfo = {
      issueTypeId: 1, filterFromTransTime: new Date('2024-12-19 08:04:13.000'), minAllowanceTime: 3,
      tvDetectionValue: 0, minAcceptType: minAcceptType
    } as RequestInfoForCopy;
    const expected = `\nTV Detection: Off`
      + `\n08:04:13(Provider) + 3s = 08:04:16`
      + ` This check time start void (Pending Accept)`;

    // Action
    const result = TvDetectionService.getTvDetection(requestInfo);

    // Assert
    expect(result).toEqual(expected);
  });

  it('#getTvDetection should return expected when TvDetection On - Slow', () => {
    // Arrange
    const requestInfo = {
      issueTypeId: 1, serviceAcceptTime: '08:04:13 AM', minAllowanceTime: 3,
      tvDetectionValue: 1, minuteOffset: '0', secondOffset: '9', minAcceptType: minAcceptType
    } as RequestInfoForCopy;
    const expected = `\nTV Detection: On`
      + `\n08:04:13(TV) - 9s(Slow) = 08:04:04 + 3s = 08:04:07`
      + ` This check time start void (Pending Accept)`;

    // Action
    const result = TvDetectionService.getTvDetection(requestInfo);

    // Assert
    expect(result).toEqual(expected);
  });

  it('#getTvDetection should return expected when TvDetection On - Fast', () => {
    // Arrange
    const requestInfo = {
      issueTypeId: 1, serviceAcceptTime: '08:04:13', minAllowanceTime: 3,
      tvDetectionValue: 2, minuteOffset: '0', secondOffset: '9', minAcceptType: minAcceptType
    } as RequestInfoForCopy;
    const expected = `\nTV Detection: On`
      + `\n08:04:13(TV) + 9s(Fast) = 08:04:22 + 3s = 08:04:25`
      + ` This check time start void (Pending Accept)`;

    // Action
    const result = TvDetectionService.getTvDetection(requestInfo);

    // Assert
    expect(result).toEqual(expected);
  });
});
