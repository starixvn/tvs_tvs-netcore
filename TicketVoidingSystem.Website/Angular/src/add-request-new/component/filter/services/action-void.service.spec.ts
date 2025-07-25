import { TestBed } from '@angular/core/testing';
import { ActionVoidService } from './action-void.service';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AbnormalFilterBy, ActionVoidByIssueTypeConst, TVSRequestActionType } from '../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { Selection } from '../../../../utility/models/selection.model';

describe('ActionVoidService', () => {
  let service: ActionVoidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ActionVoidService]
    });

    service = TestBed.inject(ActionVoidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVoidActionsSelectionByIssueType', () => {
    const mockOriginActions: Selection[] = [
      { value: '1', name: 'Action 1' },
      { value: '2', name: 'Action 2' },
      { value: '3', name: 'Action 3' }
    ];

    it('should return original actions when issueTypeId is not provided', () => {
      const result = service.getVoidActionsSelectionByIssueType(
        null,
        AbnormalFilterBy.SINGLE,
        false,
        '',
        mockOriginActions
      );

      expect(result).toEqual(mockOriginActions);
    });

    it('should return correct actions for REDUCED_OVER issue type', () => {
      const result = service.getVoidActionsSelectionByIssueType(
        Number(IssueTypeConstant.REDUCED_OVER),
        AbnormalFilterBy.SINGLE,
        false,
        '',
        mockOriginActions
      );

      expect(result).toEqual(
        ActionVoidByIssueTypeConst.REDUCED_OVER.map(id => ({
          value: id.toString(),
          name: mockOriginActions.find(action => action.value === id.toString())?.name || ''
        }))
      );
    });

    it('should return correct actions for ABNORMAL_BET issue type with SINGLE filter', () => {
      const result = service.getVoidActionsSelectionByIssueType(
        Number(IssueTypeConstant.ABNORMAL_BET),
        AbnormalFilterBy.SINGLE,
        false,
        '',
        mockOriginActions
      );

      expect(result).toEqual(
        ActionVoidByIssueTypeConst.ABNORMAL_BET_SINGLE.map(id => ({
          value: id.toString(),
          name: mockOriginActions.find(action => action.value === id.toString())?.name || ''
        }))
      );
    });

    it('should return correct actions for ABNORMAL_BET issue type with SYSTEM_PARLAY filter', () => {
      const result = service.getVoidActionsSelectionByIssueType(
        Number(IssueTypeConstant.ABNORMAL_BET),
        AbnormalFilterBy.SYSTEM_PARLAY,
        false,
        '',
        mockOriginActions
      );

      expect(result).toEqual(
        ActionVoidByIssueTypeConst.ABNORMAL_BET_MIX_OR_SYSTEM_PARLAY.map(id => ({
          value: id.toString(),
          name: mockOriginActions.find(action => action.value === id.toString())?.name || ''
        }))
      );
    });

    it('should return correct actions for DUPLICATE_TICKETS issue type in edit mode with AUTO_VOID_INSTANT', () => {
      const result = service.getVoidActionsSelectionByIssueType(
        Number(IssueTypeConstant.DUPLICATE_TICKETS),
        AbnormalFilterBy.SINGLE,
        true,
        TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString(),
        mockOriginActions
      );

      expect(result).toEqual(
        ActionVoidByIssueTypeConst.DUPLICATE_TICKETS_AUTO_ADD_REQUEST.map(id => ({
          value: id.toString(),
          name: mockOriginActions.find(action => action.value === id.toString())?.name || ''
        }))
      );
    });

    it('should return correct actions for DUPLICATE_TICKETS issue type in add mode', () => {
      const result = service.getVoidActionsSelectionByIssueType(
        Number(IssueTypeConstant.DUPLICATE_TICKETS),
        AbnormalFilterBy.SINGLE,
        false,
        '',
        mockOriginActions
      );

      expect(result).toEqual(
        ActionVoidByIssueTypeConst.DUPLICATE_TICKETS_ADD_REQUEST.map(id => ({
          value: id.toString(),
          name: mockOriginActions.find(action => action.value === id.toString())?.name || ''
        }))
      );
    });

    it('should return correct actions for WRONG_ODDS issue type', () => {
      const result = service.getVoidActionsSelectionByIssueType(
        Number(IssueTypeConstant.WRONG_ODDS),
        AbnormalFilterBy.SINGLE,
        false,
        '',
        mockOriginActions
      );

      expect(result).toEqual(
        ActionVoidByIssueTypeConst.WRONG_ODDS.map(id => ({
          value: id.toString(),
          name: mockOriginActions.find(action => action.value === id.toString())?.name || ''
        }))
      );
    });

    it('should return correct actions for TECHNICAL_ERROR issue type', () => {
      const result = service.getVoidActionsSelectionByIssueType(
        Number(IssueTypeConstant.TECHNICAL_ERROR),
        AbnormalFilterBy.SINGLE,
        false,
        '',
        mockOriginActions
      );

      expect(result).toEqual(
        ActionVoidByIssueTypeConst.TECHNICAL_ERROR.map(id => ({
          value: id.toString(),
          name: mockOriginActions.find(action => action.value === id.toString())?.name || ''
        }))
      );
    });
  });
}); 