import { GroupModel } from './group.model';
import { TicketModel } from './ticket.model';
import { TicketsModel } from './tickets.model';

describe('Tickets - TicketsModel', () => {
    enum IconCheckBox {
        none = 0,
        any = 1,
        all = 2
    }
    let ticketsModel: TicketsModel;
    const sampleTicketModel1 = new TicketModel({
        no: 1, betId: '1000', value: '1000', member: 'AB88UUS01BetTrade', transDate: '09/12/2017 05:14:35 AM',
        betType: 'FT.1X2', choice: '<div class=""><span class="favorite">FT.2</span></div>',
        odds: '<span class="underdog">9.3</span> <span class="oddstype"></span>', stake: '<div class="stake ">10</div>',
        currency: 'UUS', handicap: '0', score: '1 - 0', status: '<div class="status1">Sold</div>', creator: 'AB88UUS011260',
        secondAcceptFlag: '', isDisable: false, isCricket: true, soldId: 1008, mainTransId: 0
      });

    const sampleTicketModel2 = new TicketModel({
        no: 1, betId: '1000', value: '1001', member: 'AB88UUS01BetTrade', transDate: '09/12/2017 05:14:35 AM',
        betType: 'FT.1X2', choice: '<div class=""><span class="favorite">FT.2</span></div>',
        odds: '<span class="underdog">9.3</span> <span class="oddstype"></span>', stake: '<div class="stake ">10</div>',
        currency: 'UUS', handicap: '0', score: '1 - 0', status: '<div class="status1">Running</div>', creator: 'AB88UUS011260',
        secondAcceptFlag: '', isDisable: false, isCricket: false, soldId: 1009, mainTransId: 0
        });
      const groupModel = new GroupModel('MBC Group', [sampleTicketModel1, sampleTicketModel2]);

    beforeEach(() => {
        ticketsModel = new TicketsModel();
        ticketsModel.groups = [groupModel];
      });

    it('Get ticket enable', () => {
        // Arrange
        // Action and Assert
        const actualResult = ticketsModel.getTicketEnable();
        expect(actualResult).toBeDefined();
    });

    it('Get ticket cricket', () => {
        // Arrange
        // Action
        const actualResult = ticketsModel.getTicketCricket();

        //Assert
        expect(actualResult[0].transId).toBe('1000');
    });

    it('Get ticket sold', () => {
        // Arrange
        const expectedResult = '1000,1009';
        
        // Action 
        const actualResult = ticketsModel.getTicketSold();

        //Assert
        expect(actualResult).toBe(expectedResult);
    });

    it('Change icon checkbox', () => {
        // Arrange
        ticketsModel.iconCheckBox = IconCheckBox.any;
        // Action and Assert
        ticketsModel.changeIconCheckBox();
        expect(ticketsModel.iconCheckBox.toString()).toBe('2');
    });

    it('Get lasted soldId', () => {
        // Arrange
        const expectedResult = ',1009';
        // Action and Assert
        const actualResult = ticketsModel.getLastedSoldId();
        expect(actualResult).toBe(expectedResult);
    });

    it('Check all groups drop down', () => {
        // Arrange
        const testCases = [
            { iconCheckBox: IconCheckBox.all, expectedValue: '0' },
            { iconCheckBox: IconCheckBox.none, expectedValue: '2' }
        ];
        // Action and Assert
        for (const item of testCases) {
            ticketsModel.iconCheckBox = item.iconCheckBox;
            ticketsModel.checkAllGroupsDropDown();
            expect(ticketsModel.iconCheckBox.toString()).toBe(item.expectedValue);
        }
    });

    it('Check groups', () => {
        // Arrange
        const testCases = [
            { iconCheckBox: IconCheckBox.all, expectedValue: '0' },
            { iconCheckBox: IconCheckBox.none, expectedValue: '2' }
        ];
        // Action and Assert
        for (const item of testCases) {
            ticketsModel.iconCheckBox = item.iconCheckBox;
            ticketsModel.checkGroups();
            expect(ticketsModel.iconCheckBox.toString()).toBe(item.expectedValue);
        }
    });

    it('Check settled tickets', () => {
        // Arrange
        const expectedResult = false;
        // Action and Assert
        const actualResult = ticketsModel.checkSettledTickets();
        expect(actualResult).toBe(expectedResult);
    });

    it('Is all items checked', () => {
        // Arrange
        const expectedResult = true;
        // Action and Assert
        const actualResult = ticketsModel.isAllItemsChecked();
        expect(actualResult).toBe(expectedResult);
    });

    it('Get number Of checked tickets', () => {
        // Arrange
        const expectedResult = 2;
        // Action and Assert
        const actualResult = ticketsModel.getNumberOfCheckedTickets();
        expect(actualResult).toBe(expectedResult);
    });
});