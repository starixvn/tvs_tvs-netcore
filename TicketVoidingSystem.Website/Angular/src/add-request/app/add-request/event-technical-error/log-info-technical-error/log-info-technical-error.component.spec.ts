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

    // Act
    component['updateBetTypeCountModel']();

    // Assert
    expect(component.groupBetTypesCount).toBeTruthy();
    expect(Array.isArray(component.groupBetTypesCount)).toBeTruthy();
    expect(component.groupBetTypesCount.length).toBeGreaterThan(0);
  });

  it('should show affected tickets details correctly', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.issueTypeId = '1';

    // Act
    component.showAffectedTicketsDetails();

    // Assert
    expect(component.affectedTicketsModel.isOpen).toBeTruthy();
    expect(component.affectedTicketsModel.issueTypeId).toBe(1);
  });

  it('should handle empty bet type count', () => {
    // Arrange
    component.logInfo = {
      ...Helper.fakeLogInfo,
      betTypeCount: []
    };

    // Act
    component['updateBetTypeCountModel']();

    // Assert
    expect(component.groupBetTypesCount).toEqual([]);
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

    // Act
    component['updateBetTypeCountModel']();

    // Assert
    expect(component.groupBetTypesCount.length).toBe(2);
  });
}); 