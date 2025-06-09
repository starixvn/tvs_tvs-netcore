import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LogInfoTechnicalErrorComponent } from './log-info-technical-error.component';
import { AffectedTicketService } from '../../affected-ticket/affected-ticket.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import * as _ from 'lodash';

class Helper {
  static readonly fakeLogInfo: LogInfoTechnicalError = {
    betTypeCount: [
      {
        betTypeId: '1',
        betId: '1',
        betTypeName: 'Test Bet Type',
        playerName: 'Test Player',
        ticketsCount: 5
      }
    ],
    logInfoDetail: new LogInfoDetail()
  } as unknown as LogInfoTechnicalError;

  static readonly fakePrimitiveProps = new PrimitivePropertyEvent();
}

describe('LogInfoTechnicalErrorComponent', () => {
  let component: LogInfoTechnicalErrorComponent;
  let fixture: ComponentFixture<LogInfoTechnicalErrorComponent>;
  let staticService: StaticService;
  let affectedTicketService: AffectedTicketService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AffectedTicketService,
        StaticService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoTechnicalErrorComponent);
    staticService = fixture.debugElement.injector.get(StaticService);
    affectedTicketService = fixture.debugElement.injector.get(AffectedTicketService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display full date time format correctly', () => {
    // Arrange
    const testDate = new Date('2024-03-20T10:00:00');

    // Act
    const result = component.displayFullDateTimeFormat(testDate);

    // Assert
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should count info content correctly', () => {
    // Arrange
    const cashOutCount = 5;
    const settleCount = 3;
    const instantlySettleCount = 2;

    // Act
    const result = component.countInfoContent(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should show count info correctly', () => {
    // Arrange
    const cashOutCount = 5;
    const settleCount = 3;
    const instantlySettleCount = 2;

    // Act
    const result = component.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(typeof result).toBe('boolean');
  });

  it('should update bet type count model correctly', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    affectedTicketService.updateBetTypeCountModel = jest.fn().mockReturnValue([{
      betTypeId: '1',
      betTypeName: 'Test Bet Type',
      ticketsCount: 5
    }]);
    

    // Act
    component['updateBetTypeCountModel']();

    // Assert
    expect(component.affectedTicketsModel.groupBetTypesCount).toBeTruthy();
    expect(Array.isArray(component.affectedTicketsModel.groupBetTypesCount)).toBeTruthy();
    expect(component.affectedTicketsModel.groupBetTypesCount.length).toBe(1);
    expect(component.affectedTicketsModel.isShowDetailBetTypeCount).toBe(true);
  });

  it('should show affected tickets details correctly', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.issueTypeId = '1';
    affectedTicketService.updateBetTypeCountModel = jest.fn().mockReturnValue([{
      betTypeId: '1',
      betTypeName: 'Test Bet Type',
      ticketsCount: 5
    }]);

    // Act
    component.showAffectedTicketsDetails();

    // Assert
    expect(component.affectedTicketsModel.isOpen).toBe(true);
    expect(component.affectedTicketsModel.issueTypeId).toBe(1);
    expect(component.affectedTicketsModel.logInfoTicketsJson).toBe(component.logInfo.logInfoDetail.logInfoTicketsJson);
    expect(component.affectedTicketsModel.isShowDetailBetTypeCount).toBe(true);
  });

  it('should handle empty bet type count', () => {
    // Arrange
    component.logInfo = {
      ...Helper.fakeLogInfo,
      betTypeCount: []
    };
    affectedTicketService.updateBetTypeCountModel = jest.fn().mockReturnValue([]);

    // Act
    component['updateBetTypeCountModel']();

    // Assert
    expect(component.affectedTicketsModel.groupBetTypesCount).toEqual([]);
  });

  it('should handle multiple bet types correctly', () => {
    // Arrange
    component.logInfo = {
      ...Helper.fakeLogInfo,
      betTypeCount: [
        {
          betTypeId: '1',
          betId: '1',
          betTypeName: 'Test Bet Type 1',
          playerName: 'Test Player 1',
          ticketsCount: 5
        },
        {
          betTypeId: '2',
          betId: '2',
          betTypeName: 'Test Bet Type 2',
          playerName: 'Test Player 2',
          ticketsCount: 3
        }
      ]
    } as unknown as LogInfoTechnicalError;
    affectedTicketService.updateBetTypeCountModel = jest.fn().mockReturnValue([
      {
        betTypeId: '1',
        betTypeName: 'Test Bet Type 1',
        ticketsCount: 5
      },
      {
        betTypeId: '2',
        betTypeName: 'Test Bet Type 2',
        ticketsCount: 3
      }
    ]);

    // Act
    component['updateBetTypeCountModel']();

    // Assert
    expect(component.affectedTicketsModel.groupBetTypesCount.length).toBe(2);
  });

  it('should handle null bet type count', () => {
    // Arrange
    component.logInfo = {
      ...Helper.fakeLogInfo,
      betTypeCount: null
    };
    affectedTicketService.updateBetTypeCountModel = jest.fn().mockReturnValue([]);

    // Act
    component['updateBetTypeCountModel']();

    // Assert
    expect(component.affectedTicketsModel.groupBetTypesCount).toEqual([]);
  });

  it('should handle undefined bet type count', () => {
    // Arrange
    component.logInfo = {
      ...Helper.fakeLogInfo,
      betTypeCount: undefined
    };
    affectedTicketService.updateBetTypeCountModel = jest.fn().mockReturnValue([]);

    // Act
    component['updateBetTypeCountModel']();

    // Assert
    expect(component.affectedTicketsModel.groupBetTypesCount).toEqual([]);
  });

  it('should update affected tickets model correctly', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.issueTypeId = '1';
    affectedTicketService.updateBetTypeCountModel = jest.fn().mockReturnValue([{
      betTypeId: '1',
      betTypeName: 'Test Bet Type',
      ticketsCount: 5
    }]);

    // Act
    component.showAffectedTicketsDetails();

    // Assert
    expect(component.affectedTicketsModel.isOpen).toBe(true);
    expect(component.affectedTicketsModel.issueTypeId).toBe(1);
    expect(component.affectedTicketsModel.logInfoTicketsJson).toBe(component.logInfo.logInfoDetail.logInfoTicketsJson);
    expect(component.affectedTicketsModel.isShowDetailBetTypeCount).toBe(true);
  });
}); 