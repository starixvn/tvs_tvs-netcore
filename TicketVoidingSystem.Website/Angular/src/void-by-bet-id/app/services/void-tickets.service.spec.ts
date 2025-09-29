import { TestBed } from '@angular/core/testing';
import { ConfirmationComponent } from '../../../utility/components/confirmation/confirmation.component';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { GroupModel } from '../../../utility/components/tickets/group.model';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { PasswordService } from '../../../utility/services/password.service';
import { FilterComponent } from '../filter/filter.component';
import { TicketsViewModel } from '../model/get-tickets.query';
import { VoidTicketsRequest } from '../model/void-by-bet-id.model';
import { VoidTicketsService } from './void-tickets.service';

describe('VoidTicketsService', () => {
  let service: VoidTicketsService;
  let passwordService: PasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [VoidTicketsService, PasswordService]
    });

    service = TestBed.inject(VoidTicketsService);
    passwordService = TestBed.inject(PasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createVoidBetRequest', () => {
    it('should create void bet request with all required parameters', () => {
      // Arrange
      const mockParams = {
        ticketsViewModel: {
          groups: [
            {
              tickets: [
                { 
                  value: '1', 
                  siteDbGroupId: 'site1', 
                  isChecked: true, 
                  isDisable: false,
                  isCricket: false
                }
              ]
            }
          ] as unknown as GroupModel[],
          getAllTicket: () => [{ ticketId: '1' }]
        } as unknown as TicketsViewModel,
        matchViewModel: { matchId: '123' } as unknown as MatchModel,
        filterComponent: { abnormalBetType: '1' } as FilterComponent,
        confirmationComponent: {
          confirmation: {
            userPassword: 'password123',
            userName: 'testUser',
            reason: 'test reason',
            reasonSC: 'test reason SC'
          }
        } as ConfirmationComponent,
        messagesComponent: { message: 'test message' } as unknown as TemplateMessageComponent,
        selectedSubIssueTypeId: 1,
        subIssueTypes: [
          {
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Issue',
            subIssueTypeNameCS: 'Test Issue CS'
          }
        ] as SubIssueType[]
      };

      jest.spyOn(passwordService, 'hash').mockReturnValue('hashedPassword');

      // Act
      const result = service.createVoidBetRequest(mockParams);

      // Assert
      expect(result).toBeInstanceOf(VoidTicketsRequest);
      expect(result.tickets).toEqual([{ transId: '1', siteDbGroupId: 'site1' }]);
      expect(result.transIdCrickets).toEqual([]);
      expect(result.password).toBe('hashedPassword');
      expect(result.username).toBe('testUser');
      expect(result.reason).toBe('test reason');
      expect(result.reasonSC).toBe('test reason SC');
      expect(result.match).toEqual({ matchId: '123' });
      expect(result.abnormalBetType).toBe("1");
      expect(result.message).toBe('test message');
      expect(result.guid).toContain('VoidByBetId-');
      expect(result.issueTypeId).toBe(11);
      expect(result.subIssueTypeId).toBe(1);
      expect(result.subIssueTypeName).toBe('Test Issue');
      expect(result.subIssueTypeNameCS).toBe('Test Issue CS');
    });

    it('should create void bet request without sub issue type when not provided', () => {
      // Arrange
      const mockParams = {
        ticketsViewModel: {
          groups: [
            {
              tickets: [
                { 
                  value: '1', 
                  siteDbGroupId: 'site1', 
                  isChecked: true, 
                  isDisable: false,
                  isCricket: false
                }
              ]
            }
          ],
          getAllTicket: () => [{ ticketId: '1' }]
        } as unknown as TicketsViewModel,
        matchViewModel: { matchId: '123' } as unknown as MatchModel,
        filterComponent: { abnormalBetType: '1' } as FilterComponent,
        confirmationComponent: {
          confirmation: {
            userPassword: 'password123',
            userName: 'testUser',
            reason: 'test reason',
            reasonSC: 'test reason SC'
          }
        } as ConfirmationComponent,
        messagesComponent: { message: 'test message' } as unknown as TemplateMessageComponent,
        selectedSubIssueTypeId: 0,
        subIssueTypes: [] as SubIssueType[]
      };

      jest.spyOn(passwordService, 'hash').mockReturnValue('hashedPassword');

      // Act
      const result = service.createVoidBetRequest(mockParams);

      // Assert
      expect(result.issueTypeId).toBeUndefined();
      expect(result.subIssueTypeId).toBeUndefined();
      expect(result.subIssueTypeName).toBeUndefined();
      expect(result.subIssueTypeNameCS).toBeUndefined();
    });
  });

  describe('createCheckingPermissionModel', () => {
    it('should create checking permission model with correct parameters', () => {
      // Arrange
      const mockTicketsViewModel = {
        groups: [
          {
            tickets: [
              { 
                value: '1', 
                siteDbGroupId: 'site1', 
                isChecked: true, 
                isDisable: false
              }
            ]
          }
        ]
      } as unknown as TicketsViewModel;
      const mockMatchViewModel = { matchId: '123' } as unknown as MatchModel;

      // Act
      const result = service.createCheckingPermissionModel(mockTicketsViewModel, mockMatchViewModel);

      // Assert
      expect(result).toBeDefined();
      expect(result.tickets).toEqual([{ transId: '1', siteDbGroupId: 'site1' }]);
      expect(result.matchId).toBe('123');
    });
  });
});