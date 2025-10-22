import { TestBed } from '@angular/core/testing';
import { RequestDetailViewModel } from '../../../../add-request-new/models/request-detail.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { StaticService } from '../../../../utility/services/static.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidPageEarlyKickOffModel } from '../models/void-page-early-kick-off.model';
import { TemplateMessageService } from './template-message.service';

class Helper {
  static readonly fakeMatchModel = {
    matchId: 100,
    sportType: 'Football',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    kickOffTime: '2024-01-01T15:00:00Z'
  } as unknown as MatchModel;

  static readonly fakeVoidTicketsMini = {
    isHasSettledTicket: true,
    isAllLiveTickets: true,
    isAllNonLiveTickets: false,
    licenseeAffectedList: ['Licensee1', 'Licensee2']
  } as unknown as TicketsModel;

  static readonly fakeVoidPageItem: VoidPageEarlyKickOffModel = {
    matchModel: Helper.fakeMatchModel,
    voidTicketsMini: Helper.fakeVoidTicketsMini,
    requestDetailId: 1,
    subIssueType: { subIssueTypeId: 1, subIssueTypeName: 'Early Kick Off' }
  } as unknown as VoidPageEarlyKickOffModel;

  static readonly fakeRequestDetailEarlyKickOff: RequestDetailViewModel = {
    requestId: 123,
    request: {
      issueTypeId: 1, // Early Kick Off
      requestId: 123
    },
    earlyKickOffModels: [
      {
        matchId: 100,
        kickOffTime: '2024-01-01T14:30:00Z'
      }
    ]
  } as RequestDetailViewModel;

  static readonly fakeRequestDetailWrongKickOff: RequestDetailViewModel = {
    requestId: 124,
    request: {
      issueTypeId: 2, // Wrong Kick Off
      requestId: 124
    },
    earlyKickOffModels: [
      {
        matchId: 100,
        kickOffTime: '2024-01-01T16:00:00Z'
      }
    ]
  } as RequestDetailViewModel;

  static readonly fakeRequestDetailWrongOfferedName: RequestDetailViewModel = {
    requestId: 125,
    request: {
      issueTypeId: 3, // Wrong Offered Name
      requestId: 125
    },
    wrongOfferedNameModel: {
      wrongName: 'Wrong Team Name',
      actualName: 'Correct Team Name',
      wrongNameT: 'Wrong Team Name T',
      actualNameT: 'Correct Team Name T',
      wrongNameS: 'Wrong Team Name S',
      actualNameS: 'Correct Team Name S'
    }
  } as RequestDetailViewModel;

  static readonly fakeRequestDetailOther: RequestDetailViewModel = {
    requestId: 126,
    request: {
      issueTypeId: 4, // Other issue type
      requestId: 126
    },
    earlyKickOffModels: []
  } as RequestDetailViewModel;

  static readonly fakeTemplateValue = new TemplateValue();
}

describe('TemplateMessageService', () => {
  let service: TemplateMessageService;
  let templateService: TemplateService;

  beforeEach(() => {
    const mockTemplateService = {
      initializeTemplateValue: jest.fn().mockReturnValue(Helper.fakeTemplateValue)
    };

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        TemplateMessageService,
        { provide: TemplateService, useValue: mockTemplateService }
      ]
    });

    service = TestBed.inject(TemplateMessageService);
    templateService = TestBed.inject(TemplateService);
    
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTemplateValue', () => {
    beforeEach(() => {
      // Mock StaticService methods
      jest.spyOn(StaticService, 'isEarlyKickOff').mockImplementation((issueTypeId: number) => issueTypeId === 1);
      jest.spyOn(StaticService, 'isWrongKickOff').mockImplementation((issueTypeId: number) => issueTypeId === 2);
      jest.spyOn(StaticService, 'isWrongOfferedName').mockImplementation((issueTypeId: number) => issueTypeId === 3);
    });

    it('should return template value with match model when matchModel exists', () => {
      // Arrange
      const voidPageItem = Helper.fakeVoidPageItem;
      const requestDetail = Helper.fakeRequestDetailOther;

      // Action
      const result = service.getTemplateValue(voidPageItem, requestDetail);

      // Assert
      expect(templateService.initializeTemplateValue).toHaveBeenCalledWith(Helper.fakeMatchModel);
      expect(result).toBeDefined();
      expect(result.checkSettled).toBe(true);
    });

    it('should set wrong offered name fields for Wrong Offered Name issue type', () => {
      // Arrange
      const voidPageItem = Helper.fakeVoidPageItem;
      const requestDetail = Helper.fakeRequestDetailWrongOfferedName;

      // Action
      const result = service.getTemplateValue(voidPageItem, requestDetail);

      // Assert
      expect(result.wrongName).toBe('Wrong Team Name');
      expect(result.actualName).toBe('Correct Team Name');
      expect(result.wrongNameT).toBe('Wrong Team Name T');
      expect(result.actualNameT).toBe('Correct Team Name T');
      expect(result.wrongNameS).toBe('Wrong Team Name S');
      expect(result.actualNameS).toBe('Correct Team Name S');
    });

    it('should handle case when earlyKickOffModels is empty for kick off issue types', () => {
      // Arrange
      const voidPageItem = Helper.fakeVoidPageItem;
      const requestDetail = {
        ...Helper.fakeRequestDetailEarlyKickOff,
        earlyKickOffModels: []
      };

      // Action & Assert
      expect(() => service.getTemplateValue(voidPageItem, requestDetail)).toThrow();
    });

    it('should handle case when earlyKickOffModels does not contain matching matchId', () => {
      // Arrange
      const voidPageItem = Helper.fakeVoidPageItem;
      const requestDetail = {
        ...Helper.fakeRequestDetailEarlyKickOff,
        earlyKickOffModels: [{ matchId: 999, kickOffTime: '2024-01-01T14:30:00Z' }]
      } as unknown as RequestDetailViewModel;

      // Action & Assert
      expect(() => service.getTemplateValue(voidPageItem, requestDetail)).toThrow();
    });

    it('should set checkSettled from voidTicketsMini.isHasSettledTicket', () => {
      // Arrange
      const voidPageItem = {
        ...Helper.fakeVoidPageItem,
        voidTicketsMini: { ...Helper.fakeVoidTicketsMini, isHasSettledTicket: false }
      } as unknown as VoidPageEarlyKickOffModel     ;
      const requestDetail = Helper.fakeRequestDetailOther;

      // Action
      const result = service.getTemplateValue(voidPageItem, requestDetail);

      // Assert
      expect(result.checkSettled).toBe(false);
    });
  });
});
