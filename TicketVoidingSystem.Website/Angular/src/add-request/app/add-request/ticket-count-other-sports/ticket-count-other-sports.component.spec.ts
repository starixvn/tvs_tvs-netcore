
import { TicketCountOtherSportsComponent } from './ticket-count-other-sports.component';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';

describe('TicketCountOtherSportsComponent', () => {
  let instance: TicketCountOtherSportsComponent;

  beforeEach(() => {
    instance = new TicketCountOtherSportsComponent();
    instance.logInfoDetail = {singleCount: 1, cashOutCount: 0, settleCount: 0, instantlySettleCount: 0, mainParlayCount: 2} as LogInfoDetail;
    instance.isVoided = false;
  });
  
  it('#clickOpenTicketDetails show call event openTicketDetails', async () => {
     const fakeEventOpenTicketDetails = jest.fn();  
    instance.openTicketDetails.emit = fakeEventOpenTicketDetails;
    instance.clickOpenTicketDetails();
    expect(fakeEventOpenTicketDetails).toBeCalled();
  });

  it('#isShowCountInfo show return true', async () => {
   const testInputs = [{cashOutCount: 1, settleCount: 0, instantlySettleCount: 0},
    {cashOutCount: 0, settleCount: 1, instantlySettleCount: 0},
    {cashOutCount: 0, settleCount: 0, instantlySettleCount: 1},
    {cashOutCount: 0, settleCount: 1, instantlySettleCount: 1},
    {cashOutCount: 1, settleCount: 1, instantlySettleCount: 1}
   ];

   testInputs.forEach(x => {
    const actual = instance.isShowCountInfo(x.cashOutCount, x.settleCount, x.instantlySettleCount);
    expect(actual).toBeTruthy();
   })
  });

 it('#isShowCountInfo show return false', async () => {
  const actual = instance.isShowCountInfo(0, 0, 0);
   expect(actual).toBeFalsy();
 });

 it('#countInfoContent has only cashOut Ticket return expected', async () => {
  const expected = ' (Cash Out: <strong>1</strong>)';
  const actual = instance.countInfoContent(1, 0, 0);
   expect(actual).toEqual(expected);
 });

 it('#countInfoContent has only instantlySettle Ticket return expected', async () => {
  const expected = ' (Settled: <strong>1</strong>)';
  const actual = instance.countInfoContent(0, 1, 0);
   expect(actual).toEqual(expected);
 });

 it('#countInfoContent has only settle Ticket return expected', async () => {
  const expected = ' (Instantly Settled: <strong>1</strong>)';
  const actual = instance.countInfoContent(0, 0, 1);
   expect(actual).toEqual(expected);
 });
});
