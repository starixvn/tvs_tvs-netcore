import { TestBed } from '@angular/core/testing';
import { LogChangeContentService } from './log-change-content.service';
import { CommonService } from '../../../utility/services/common.service';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { VoidReasonComponent } from '../message-area/void-reason/void-reason.component';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { VoidedReason } from '../../../utility/models/reason.model';
import { Message } from '../../../utility/components/template-message/messages/message';
import { TestingModule } from '../../../utility/modules/testing.module';

describe('LogChangeContentService', () => {
  let service: LogChangeContentService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LogChangeContentService, CommonService]
    });

    service = TestBed.inject(LogChangeContentService);
    commonService = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('writeLog', () => {
    it('should call writeLogEditVoidReason when reason has changed', async () => {
      // Arrange
      const requestId = 123;
      const oldReason: VoidedReason = {
        reasonEnglish: 'Old English reason',
        reasonChineseSimplified: 'Old Chinese reason'
      };
      const newReason: VoidedReason = {
        reasonEnglish: 'New English reason',
        reasonChineseSimplified: 'New Chinese reason'
      };

      const mockReasonComponent = {
        initialReason: oldReason
      } as VoidReasonComponent;

      const mockMessageAreaComponent = {
        reasonComponent: mockReasonComponent,
        voidReason: newReason,
        templateMessageComponent: null
      } as MessageAreaComponent;

      jest.spyOn(service, 'writeLogEditVoidReason').mockResolvedValue(undefined);

      // Act
      await service.writeLog(requestId, [mockMessageAreaComponent]);

      // Assert
      expect(service.writeLogEditVoidReason).toHaveBeenCalledWith(requestId, oldReason, newReason);
    });

    it('should not call writeLogEditVoidReason when reason has not changed', async () => {
      // Arrange
      const requestId = 123;
      const sameReason: VoidedReason = {
        reasonEnglish: 'Same English reason',
        reasonChineseSimplified: 'Same Chinese reason'
      };

      const mockReasonComponent = {
        initialReason: sameReason
      } as VoidReasonComponent;

      const mockMessageAreaComponent = {
        reasonComponent: mockReasonComponent,
        voidReason: sameReason,
        templateMessageComponent: null
      } as MessageAreaComponent;

      jest.spyOn(service, 'writeLogEditVoidReason').mockResolvedValue(undefined);

      // Act
      await service.writeLog(requestId, [mockMessageAreaComponent]);

      // Assert
      expect(service.writeLogEditVoidReason).not.toHaveBeenCalled();
    });

    it('should call writeLogEditVoidMessage when message has changed', async () => {
      // Arrange
      const requestId = 123;
      const oldMessage: Message = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Old English message',
        contentChineseTraditional: 'Old Traditional Chinese',
        contentChineseSimplified: 'Old Simplified Chinese',
        contentNewChineseSimplified: 'Old New Simplified Chinese',
        contentThai: 'Old Thai',
        contentKorean: 'Old Korean',
        contentJapanese: 'Old Japanese',
        contentItalian: 'Old Italian',
        contentSpanish: 'Old Spanish',
        playerNamesEnglish: 'Old Player Names',
        playerNamesChineseTraditional: 'Old Traditional Player Names',
        playerNamesChineseSimplified: 'Old Simplified Player Names',
        isTVSAddOrEditPage: false
      };

      const newMessage: Message = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'New English message',
        contentChineseTraditional: 'New Traditional Chinese',
        contentChineseSimplified: 'New Simplified Chinese',
        contentNewChineseSimplified: 'New New Simplified Chinese',
        contentThai: 'New Thai',
        contentKorean: 'New Korean',
        contentJapanese: 'New Japanese',
        contentItalian: 'New Italian',
        contentSpanish: 'New Spanish',
        playerNamesEnglish: 'New Player Names',
        playerNamesChineseTraditional: 'New Traditional Player Names',
        playerNamesChineseSimplified: 'New Simplified Player Names',
        isTVSAddOrEditPage: false
      };

      const mockTemplateMessageComponent = {
        initialMessage: oldMessage,
        message: newMessage
      } as TemplateMessageComponent;

      const mockMessageAreaComponent = {
        reasonComponent: { initialReason: { reasonEnglish: 'Same' } } as VoidReasonComponent,
        voidReason: { reasonEnglish: 'Same' } as VoidedReason,
        templateMessageComponent: mockTemplateMessageComponent
      } as MessageAreaComponent;

      jest.spyOn(service, 'writeLogEditVoidMessage').mockResolvedValue(undefined);

      // Act
      await service.writeLog(requestId, [mockMessageAreaComponent]);

      // Assert
      expect(service.writeLogEditVoidMessage).toHaveBeenCalledWith(requestId, oldMessage, newMessage);
    });

    it('should not call writeLogEditVoidMessage when message has not changed', async () => {
      // Arrange
      const requestId = 123;
      const sameMessage: Message = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Same English message',
        contentChineseTraditional: 'Same Traditional Chinese',
        contentChineseSimplified: 'Same Simplified Chinese',
        contentNewChineseSimplified: 'Same New Simplified Chinese',
        contentThai: 'Same Thai',
        contentKorean: 'Same Korean',
        contentJapanese: 'Same Japanese',
        contentItalian: 'Same Italian',
        contentSpanish: 'Same Spanish',
        playerNamesEnglish: 'Same Player Names',
        playerNamesChineseTraditional: 'Same Traditional Player Names',
        playerNamesChineseSimplified: 'Same Simplified Player Names',
        isTVSAddOrEditPage: false
      };

      const mockTemplateMessageComponent = {
        initialMessage: sameMessage,
        message: sameMessage
      } as TemplateMessageComponent;

      const mockMessageAreaComponent = {
        reasonComponent: { initialReason: { reasonEnglish: 'Same' } } as VoidReasonComponent,
        voidReason: { reasonEnglish: 'Same' } as VoidedReason,
        templateMessageComponent: mockTemplateMessageComponent
      } as MessageAreaComponent;

      jest.spyOn(service, 'writeLogEditVoidMessage').mockResolvedValue(undefined);

      // Act
      await service.writeLog(requestId, [mockMessageAreaComponent]);

      // Assert
      expect(service.writeLogEditVoidMessage).not.toHaveBeenCalled();
    });

    it('should not call writeLogEditVoidMessage when templateMessageComponent is null', async () => {
      // Arrange
      const requestId = 123;
      const mockMessageAreaComponent = {
        reasonComponent: { initialReason: { reasonEnglish: 'Same' } } as VoidReasonComponent,
        voidReason: { reasonEnglish: 'Same' } as VoidedReason,
        templateMessageComponent: null
      } as MessageAreaComponent;

      jest.spyOn(service, 'writeLogEditVoidMessage').mockResolvedValue(undefined);

      // Act
      await service.writeLog(requestId, [mockMessageAreaComponent]);

      // Assert
      expect(service.writeLogEditVoidMessage).not.toHaveBeenCalled();
    });

    it('should handle multiple message area components', async () => {
      // Arrange
      const requestId = 123;
      const oldReason: VoidedReason = {
        reasonEnglish: 'Old English reason',
        reasonChineseSimplified: 'Old Chinese reason'
      };
      const newReason: VoidedReason = {
        reasonEnglish: 'New English reason',
        reasonChineseSimplified: 'New Chinese reason'
      };

      const mockMessageAreaComponents = [
        {
          reasonComponent: { initialReason: oldReason } as VoidReasonComponent,
          voidReason: newReason,
          templateMessageComponent: null
        } as MessageAreaComponent,
        {
          reasonComponent: { initialReason: { reasonEnglish: 'Same' } } as VoidReasonComponent,
          voidReason: { reasonEnglish: 'Same' } as VoidedReason,
          templateMessageComponent: null
        } as MessageAreaComponent
      ];

      jest.spyOn(service, 'writeLogEditVoidReason').mockResolvedValue(undefined);

      // Act
      await service.writeLog(requestId, mockMessageAreaComponents);

      // Assert
      expect(service.writeLogEditVoidReason).toHaveBeenCalledTimes(1);
      expect(service.writeLogEditVoidReason).toHaveBeenCalledWith(requestId, oldReason, newReason);
    });
  });

  describe('writeLogEditVoidReason', () => {
    it('should call commonService.logChangeContent when reason has changed', async () => {
      // Arrange
      const requestId = 123;
      const oldValue: VoidedReason = {
        reasonEnglish: 'Old English reason',
        reasonChineseSimplified: 'Old Chinese reason'
      };
      const newValue: VoidedReason = {
        reasonEnglish: 'New English reason',
        reasonChineseSimplified: 'New Chinese reason'
      };

      commonService.logChangeContent = jest.fn();

      // Act
      await service.writeLogEditVoidReason(requestId, oldValue, newValue);

      // Assert
      expect(commonService.logChangeContent).toHaveBeenCalledWith(
        'Void Request - Change Reason',
        JSON.stringify({
          RequestId: requestId,
          OldValue: oldValue,
          NewValue: newValue
        })
      );
    });

    it('should call commonService.logChangeContent when only English reason has changed', async () => {
      // Arrange
      const requestId = 123;
      const oldValue: VoidedReason = {
        reasonEnglish: 'Old English reason',
        reasonChineseSimplified: 'Same Chinese reason'
      };
      const newValue: VoidedReason = {
        reasonEnglish: 'New English reason',
        reasonChineseSimplified: 'Same Chinese reason'
      };

      commonService.logChangeContent = jest.fn();

      // Act
      await service.writeLogEditVoidReason(requestId, oldValue, newValue);

      // Assert
      expect(commonService.logChangeContent).toHaveBeenCalledWith(
        'Void Request - Change Reason',
        JSON.stringify({
          RequestId: requestId,
          OldValue: oldValue,
          NewValue: newValue
        })
      );
    });

    it('should call commonService.logChangeContent when only Chinese reason has changed', async () => {
      // Arrange
      const requestId = 123;
      const oldValue: VoidedReason = {
        reasonEnglish: 'Same English reason',
        reasonChineseSimplified: 'Old Chinese reason'
      };
      const newValue: VoidedReason = {
        reasonEnglish: 'Same English reason',
        reasonChineseSimplified: 'New Chinese reason'
      };

      commonService.logChangeContent = jest.fn();

      // Act
      await service.writeLogEditVoidReason(requestId, oldValue, newValue);

      // Assert
      expect(commonService.logChangeContent).toHaveBeenCalledWith(
        'Void Request - Change Reason',
        JSON.stringify({
          RequestId: requestId,
          OldValue: oldValue,
          NewValue: newValue
        })
      );
    });

    it('should not call commonService.logChangeContent when reason has not changed', async () => {
      // Arrange
      const requestId = 123;
      const sameValue: VoidedReason = {
        reasonEnglish: 'Same English reason',
        reasonChineseSimplified: 'Same Chinese reason'
      };

      commonService.logChangeContent = jest.fn();

      // Act
      await service.writeLogEditVoidReason(requestId, sameValue, sameValue);

      // Assert
      expect(commonService.logChangeContent).not.toHaveBeenCalled();
    });
  });

  describe('writeLogEditVoidMessage', () => {
    it('should call commonService.logChangeContent with correct parameters', async () => {
      // Arrange
      const requestId = 123;
      const oldValue: Message = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Old English message',
        contentChineseTraditional: 'Old Traditional Chinese',
        contentChineseSimplified: 'Old Simplified Chinese',
        contentNewChineseSimplified: 'Old New Simplified Chinese',
        contentThai: 'Old Thai',
        contentKorean: 'Old Korean',
        contentJapanese: 'Old Japanese',
        contentItalian: 'Old Italian',
        contentSpanish: 'Old Spanish',
        playerNamesEnglish: 'Old Player Names',
        playerNamesChineseTraditional: 'Old Traditional Player Names',
        playerNamesChineseSimplified: 'Old Simplified Player Names',
        isTVSAddOrEditPage: false
      };

      const newValue: Message = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'New English message',
        contentChineseTraditional: 'New Traditional Chinese',
        contentChineseSimplified: 'New Simplified Chinese',
        contentNewChineseSimplified: 'New New Simplified Chinese',
        contentThai: 'New Thai',
        contentKorean: 'New Korean',
        contentJapanese: 'New Japanese',
        contentItalian: 'New Italian',
        contentSpanish: 'New Spanish',
        playerNamesEnglish: 'New Player Names',
        playerNamesChineseTraditional: 'New Traditional Player Names',
        playerNamesChineseSimplified: 'New Simplified Player Names',
        isTVSAddOrEditPage: false
      };

      commonService.logChangeContent = jest.fn();

      // Act
      await service.writeLogEditVoidMessage(requestId, oldValue, newValue);

      // Assert
      expect(commonService.logChangeContent).toHaveBeenCalledWith(
        'Void Request - Change Message',
        JSON.stringify({
          RequestId: requestId,
          OldValue: oldValue,
          NewValue: newValue
        })
      );
    });

    it('should call commonService.logChangeContent even when message content is the same', async () => {
      // Arrange
      const requestId = 123;
      const sameValue: Message = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Same English message',
        contentChineseTraditional: 'Same Traditional Chinese',
        contentChineseSimplified: 'Same Simplified Chinese',
        contentNewChineseSimplified: 'Same New Simplified Chinese',
        contentThai: 'Same Thai',
        contentKorean: 'Same Korean',
        contentJapanese: 'Same Japanese',
        contentItalian: 'Same Italian',
        contentSpanish: 'Same Spanish',
        playerNamesEnglish: 'Same Player Names',
        playerNamesChineseTraditional: 'Same Traditional Player Names',
        playerNamesChineseSimplified: 'Same Simplified Player Names',
        isTVSAddOrEditPage: false
      };

      commonService.logChangeContent = jest.fn();

      // Act
      await service.writeLogEditVoidMessage(requestId, sameValue, sameValue);

      // Assert
      expect(commonService.logChangeContent).toHaveBeenCalledWith(
        'Void Request - Change Message',
        JSON.stringify({
          RequestId: requestId,
          OldValue: sameValue,
          NewValue: sameValue
        })
      );
    });
  });
});
