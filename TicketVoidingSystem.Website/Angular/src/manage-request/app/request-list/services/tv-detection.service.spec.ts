import { RequestInfoForCopy } from '../../../../utility/models/copy-request-info.query';
import { TvDetectionService } from './tv-detection.service';

describe('StaticService', () => {
  it('#getTvDetection should return empty when issueType not support TvDetection', () => {
    // Arrange
    const requestInfo = {issueTypeId: 23} as RequestInfoForCopy;

    // Action
    const result = TvDetectionService.getTvDetection(requestInfo);

    // Assert
    expect(result).toEqual('');
  });

  it('#getTvDetection should return expected when TvDetection Off', () => {
    // Arrange
    const requestInfo = {issueTypeId: 1, inputtedFromTime:'08:04:13', minAllowanceTime: 3, tvDetectionValue: 0} as RequestInfoForCopy;
    const expected = `\nTV Detection: Off`
                    + `\n08:04:13(Provider) + 3s = 08:04:16`
                    + `\nThis check time start void`;
                    
    // Action
    const result = TvDetectionService.getTvDetection(requestInfo);

    // Assert
    expect(result).toEqual(expected);
  });

  it('#getTvDetection should return expected when TvDetection On - Slow', () => {
    // Arrange
    const requestInfo = {issueTypeId: 1, serviceAcceptTime:'08:04:13', minAllowanceTime: 3, 
      tvDetectionValue: 1, minuteOffset: '0', secondOffset: '9'} as RequestInfoForCopy;
    const expected = `\nTV Detection: On`
                    + `\n08:04:13(TV) - 9s(Slow) = 08:04:04 + 3s = 08:04:07`
                    + `\nThis check time start void`;
                    
    // Action
    const result = TvDetectionService.getTvDetection(requestInfo);

    // Assert
    expect(result).toEqual(expected);
  });
  
  it('#getTvDetection should return expected when TvDetection On - Fast', () => {
    // Arrange
    const requestInfo = {issueTypeId: 1, serviceAcceptTime:'08:04:13', minAllowanceTime: 3, 
      tvDetectionValue: 2, minuteOffset: '0', secondOffset: '9'} as RequestInfoForCopy;
    const expected = `\nTV Detection: On`
                    + `\n08:04:13(TV) + 9s(Fast) = 08:04:22 + 3s = 08:04:25`
                    + `\nThis check time start void`;
                    
    // Action
    const result = TvDetectionService.getTvDetection(requestInfo);

    // Assert
    expect(result).toEqual(expected);
  });
});
