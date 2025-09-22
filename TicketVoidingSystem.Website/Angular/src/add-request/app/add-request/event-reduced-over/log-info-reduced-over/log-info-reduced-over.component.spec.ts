import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { StaticService } from '../../../../../utility/services/static.service';
import { AffectedTicketService } from '../../affected-ticket/affected-ticket.service';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { LogInfoReducedOverComponent } from './log-info-reduced-over.component';

describe('LogInfoReducedOverComponent', () => {
  let component: LogInfoReducedOverComponent;
  let fixture: ComponentFixture<LogInfoReducedOverComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ModalService,
        AffectedTicketService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoReducedOverComponent);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.logInfo).toBeUndefined();
    expect(component.primitiveProps).toBeInstanceOf(PrimitivePropertyEvent);
  });

  it('should display full date time format correctly', () => {
    const testDate = new Date('2024-03-20T10:30:00');
    const formattedDate = component.displayFullDateTimeFormat(testDate);
    expect(formattedDate).toBe(moment(testDate).format(DateTimeFormat.FULL_DATE_TIME_FORMAT));
  });

  it('should open popup trans ids', () => {
    const requestId = 123;
    const transIds = 'ABC123';
    const spy = jest.spyOn(StaticService, 'openPopupTransIds');

    component.openPopupTransIds(requestId, transIds);

    expect(spy).toHaveBeenCalledWith(requestId, transIds, modalService);
  });

  it('should count info content correctly', () => {
    const cashOutCount = 2;
    const settleCount = 3;
    const instantlySettleCount = 1;
    const spy = jest.spyOn(StaticService, 'countInfoContent');

    component.countInfoContent(cashOutCount, settleCount, instantlySettleCount);

    expect(spy).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
  });

  it('should display trans id correctly when ticket count is 0', () => {
    const result = component.displayTransId(0, 'ABC123');
    expect(result).toBe('-');
  });

  it('should display trans id correctly when ticket count is greater than 0', () => {
    const transId = 'ABC123';
    const result = component.displayTransId(1, transId);
    expect(result).toBe(transId);
  });

  it('should check if show count info', () => {
    const cashOutCount = 2;
    const settleCount = 3;
    const instantlySettleCount = 1;
    const spy = jest.spyOn(StaticService, 'isShowCountInfo');

    component.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);

    expect(spy).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
  });
});
