import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { LogInfoWrongMarketOfferedComponent } from './log-info-wrong-market-offered.component';
import { LogInfoWrongMarketOffered, LogInfoItem } from '../models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { AffectedTicketService } from '../../../../../component/affected-ticket/affected-ticket.service';

class Helper {
  static readonly fakeLogInfo ={
    logInfoItems: [{
      betTypeCount: [{
        betTypeId: 1,
        betId: 1,
        betTypeName: 'Test Bet Type',
        playerName: 'Test Player',
        ticketsCount: 5
      }],
      logInfoDetail: {
        logInfoTicketsJson: '{}'
      }
    }]
  } as LogInfoWrongMarketOffered;

  static readonly fakePrimitiveProps = new PrimitivePropertyEvent();
}

describe('LogInfoWrongMarketOfferedComponent', () => {
  let component: LogInfoWrongMarketOfferedComponent;
  let fixture: ComponentFixture<LogInfoWrongMarketOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AffectedTicketService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoWrongMarketOfferedComponent);
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

  it('should show count info based on counts', () => {
    // Arrange
    const cashOutCount = 5;
    const settleCount = 3;
    const instantlySettleCount = 2;

    // Act
    const result = component.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(typeof result).toBe('boolean');
  });

  it('should show affected tickets details correctly', () => {
    // Arrange
    component.issueTypeId = '1';
    const logInfo: LogInfoItem = Helper.fakeLogInfo.logInfoItems[0];

    // Act
    component.showAffectedTicketsDetails(logInfo);

    // Assert
    expect(component.affectedTicketsModel.issueTypeId).toBe(1);
    expect(component.affectedTicketsModel.logInfoTicketsJson).toBe('{}');
    expect(component.affectedTicketsModel.isOpen).toBeTruthy();
    expect(component.affectedTicketsModel.groupBetTypesCount).toBeTruthy();
    expect(component.affectedTicketsModel.isShowDetailBetTypeCount).toBeTruthy();
  });

  it('should update bet type count model correctly', () => {
    // Arrange
    const logInfo: LogInfoItem = Helper.fakeLogInfo.logInfoItems[0];

    // Act
    component['updateBetTypeCountModel'](logInfo);

    // Assert
    expect(component.affectedTicketsModel.groupBetTypesCount.length).toBeGreaterThan(0);
    expect(component.affectedTicketsModel.groupBetTypesCount[0].name).toContain('Test Bet Type');
    expect(component.affectedTicketsModel.groupBetTypesCount[0].items[0].name).toContain('Test Player');
  });

  it('should handle empty bet type count', () => {
    // Arrange
    const logInfo: LogInfoItem = {
      betTypeCount: [],
      logInfoDetail: {
        logInfoTicketsJson: '{}'
      }
    } as LogInfoItem;

    // Act
    component['updateBetTypeCountModel'](logInfo);

    // Assert
    expect(component.affectedTicketsModel.groupBetTypesCount.length).toBe(0);
  });

  it('should handle multiple bet types correctly', () => {
    // Arrange
    const logInfo: LogInfoItem = {
      betTypeCount: [
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Bet Type 1',
          playerName: 'Player 1',
          ticketsCount: 5
        },
        {
          betTypeId: 2,
          betId: 2,
          betTypeName: 'Bet Type 2',
          playerName: 'Player 2',
          ticketsCount: 3
        }
      ],
      logInfoDetail: {
        logInfoTicketsJson: '{}'
      }
    } as LogInfoItem;

    // Act
    component['updateBetTypeCountModel'](logInfo);

    // Assert
    expect(component.affectedTicketsModel.groupBetTypesCount.length).toBe(2);
    expect(component.affectedTicketsModel.groupBetTypesCount[0].name).toContain('Bet Type 1');
    expect(component.affectedTicketsModel.groupBetTypesCount[1].name).toContain('Bet Type 2');
  });
}); 