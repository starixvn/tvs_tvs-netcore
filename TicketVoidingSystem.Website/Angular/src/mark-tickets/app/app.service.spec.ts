import { BetType, GetBetTypesQuery, GroupBetType, GroupBetTypesModel } from '../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BalanceUp } from '../../utility/models/balance-up.model';
import { SportInfo } from '../../utility/models/event.model';
import { Result } from '../../utility/models/result';
import { CommonService } from '../../utility/services/common.service';
import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import {
    ConfirmAutoUnmarkQuery, ConfirmAutoUnmarkViewModel, UpdateConfirmAutoUnmark
} from './confirm-auto-unmark/confirm-auto-unmark.model';
import { AllMarkedTicketsModel } from './mark-unmark-ticket/all-marked-ticket-list/all-marked-ticket.model';
import { Currency } from './mark-unmark-ticket/filter-tickets/filter.model';
import { GroupLicensee } from './mark-unmark-ticket/filter-tickets/match-id/licensees/licensees.model';
import { AllMarkedTicketQuery, GetLogsQuery, GetTicketsQuery, MarkedTicketQuery, TicketDetailQuery } from './models/query.model';
import { DataPermission, ResultMarkTicketModel } from './models/result.model';
import { GroupModel } from './tickets-list/group-tickets.model';
import { TicketModel } from './tickets-list/ticket.model';
import { TicketsModel } from './tickets-list/tickets.model';
import { LogsModel } from './user-log/logs-list/logs-list.model';

jest.mock('../../utility/services/http.service');
describe('AppService', () => {
    let mockHttpService: jest.Mocked<HttpService>;
    let appService: AppService;
    let commonService: CommonService;

    beforeEach(() => {
        mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
        appService = new AppService(mockHttpService);
        commonService = new CommonService(mockHttpService);
    });

    it('Get balance up', async () => {
        // Arrange
        const expectedBalanceUp: BalanceUp = {
            balanceUpDay: new Date(),
            moveBetsDay: new Date()
        };

        mockHttpService.getJson.mockResolvedValue(expectedBalanceUp);

        // Action and Assert
        const result = await commonService.getBalanceUp();
        expect(result.moveBetsDay).toBe(expectedBalanceUp.moveBetsDay);
        expect(result.balanceUpDay).toBe(expectedBalanceUp.balanceUpDay);
    });

    it('Get Currencies', async () => {
        // Arrange
        const expectedCurrencies: Currency[] = [
            { id: 13, currencyCode: 'RMB' },
            { id: 66, currencyCode: 'YUN' }
        ];
        mockHttpService.getJson.mockResolvedValue(expectedCurrencies);

        // Action and Assert
        const result = await appService.getCurrencies();

        expect(result.length).toBe(2);
    });

    it('Get Licensees', async () => {
        // Arrange
        const expectedLicensees: GroupLicensee[] = [
            new GroupLicensee('China rules', []),
            new GroupLicensee('Asia rules', [])
        ];
        mockHttpService.getJson.mockResolvedValue(expectedLicensees);

        // Action and Assert
        const result = await appService.getGroupLicensees();

        expect(result.length).toBe(2);
        expect(result[0].groupName).toBe('China rules');

    });

    it('Get Group BetTypes', async () => {
        // Arrange
        const groupBettype: GroupBetType[] = [
            new GroupBetType('1H', [new BetType(15, '1H 1X2', false, 0, true)], true),
            new GroupBetType('FT', [new BetType(4, 'Correct Score', false, 0, true)], true),
        ];
        const expectedGroupBettypesModel = new GroupBetTypesModel(groupBettype, true);
        mockHttpService.postJson.mockResolvedValue(expectedGroupBettypesModel);

        // Action and Assert
        const result = await commonService.getGroupBetTypes(new GetBetTypesQuery());

        expect(result.groupBetTypes.length).toBe(2);
        expect(result.groupBetTypes[0].groupName).toBe('1H');
    });

    it('Get Tickets', async () => {
        // Arrange
        const expectedTicketsModel = new TicketsModel();
        expectedTicketsModel.groups.push(new GroupModel('MBC Group', [{mainTransId: '123123123'} as TicketModel ], ['12']));
        expectedTicketsModel.totalItems = 1;
        expectedTicketsModel.licenseesName = 'MBC Group';
        expectedTicketsModel.invalidTransIds = '105662749481';
        expectedTicketsModel.movedTransIds = '105663806954';
        mockHttpService.postJson.mockResolvedValue(expectedTicketsModel);

        // Action and Assert
        const result = await appService.getTickets(new GetTicketsQuery());

        expect(result.totalItems).toBe(1);
        expect(result.licenseesName).toBe('MBC Group');
    });

    it('Get All Makerd Tickets', async () => {
        // Arrange
        const expectedAllMarkedTicketsModel: AllMarkedTicketsModel = {
            ticketList: [
                {
                    no: 1, total: 227, createdDate: new Date(), matchId: '28321695', kickOffTime: new Date(),
                    htScore: '', ftScore: '', userId: 8, username: 'sa', isChecked: true, event: ''
                }
            ],
            totalItems: 1
        };
        mockHttpService.postJson.mockResolvedValue(expectedAllMarkedTicketsModel);

        // Action and Assert
        const result = await appService.getAllMakerdTickets(new GetTicketsQuery());

        expect(result.totalItems).toBe(1);
        expect(result.ticketList.length).toBe(1);
    });

    it('Get User Logs', async () => {
        // Arrange
        const expectedLogsModel: LogsModel = {
            logList: [
                {
                    action: 'Unmark',
                    actionId: 15374811,
                    doneBy: 'starix62',
                    event: 'Bangladesh U23 (ET)- vs -Sassuolo + Parana PR',
                    kickOffTime: new Date(),
                    htScore: '1-0',
                    ftScore: '1-0',
                    logDate: new Date(),
                    matchId: 99003291,
                    no: 1,
                    singleTickets: ['11'],
                    parlayTickets: ['22']
                }
            ],
            totalLogs: 1
        };
        mockHttpService.postJson.mockResolvedValue(expectedLogsModel);

        // Action and Assert
        const result = await appService.getUserLogs(new GetLogsQuery());

        expect(result.totalLogs).toBe(1);
        expect(result.logList.length).toBe(1);
    });

    it('#exportExcel should return nothing', async () => {
        // Arrange
        const query = new GetTicketsQuery();
        const url = `api/MarkTickets/ExportExcel`;
        mockHttpService.downloadFile.mockResolvedValue();

        // Action and Assert
        expect(await appService.exportExcel(query)).toBeUndefined();
        expect(mockHttpService.downloadFile).toBeCalledTimes(1);
        expect(mockHttpService.downloadFile).toHaveBeenCalledWith(query, url);
    });

    it('#exportExcelDetailTickets should return nothing', async () => {
        // Arrange
        const query = new TicketDetailQuery();
        const url = `api/MarkTickets/ExportExcelDetailTicket`;
        mockHttpService.downloadFile.mockResolvedValue();

        // Action and Assert
        expect(await appService.exportExcelDetailTickets(query)).toBeUndefined();
        expect(mockHttpService.downloadFile).toBeCalledTimes(1);
        expect(mockHttpService.downloadFile).toHaveBeenCalledWith(query, url);
    });

    it('Update Marked Ticket', async () => {
        // Arrange
        const query: MarkedTicketQuery = {
            tickets: [],
            status: '0',
            checkPermissionTickets: []
        };
        const expectedResult: ResultMarkTicketModel = {
            isSuccessful: true,
            errorCode: 0,
            errorMsg: ''
        };
        const testCases = [
            { status: '0', message: 'Mark tickets successfully!', errorMsg: '', errorCode: 0, isSuccessful: true },
            { status: '0', message: 'Error(s):', errorMsg: 'Error', errorCode: 100, isSuccessful: false },
            { status: '1', message: 'Unmark tickets successfully!', errorMsg: '', errorCode: 0, isSuccessful: true },
            { status: '1', message: 'Error(s):', errorMsg: 'Error', errorCode: 100, isSuccessful: false },
        ];
        // Action and Assert
        for (const item of testCases) {
            query.status = item.status;
            expectedResult.errorCode = item.errorCode;
            expectedResult.isSuccessful = item.isSuccessful;
            expectedResult.errorMsg = item.errorMsg;
            mockHttpService.postJson.mockResolvedValue(expectedResult);

            const result = await appService.updateMarkedTicket(query);
            if (result.isSuccessful) {
                expect(result.errorMsg).toBe(item.message);
            } else {
                expect(result.errorMsg).toBe(item.errorMsg);
            }
        }
    });

    it('Get Tickets Detail', async () => {
        // Arrange
        const expectedTicketsModel = new TicketsModel();
        expectedTicketsModel.groups.push(new GroupModel('MBC Group', [{mainTransId:'123123'} as TicketModel], []));
        expectedTicketsModel.totalItems = 1;
        expectedTicketsModel.licenseesName = 'MBC Group';
        expectedTicketsModel.invalidTransIds = '105662749481';
        expectedTicketsModel.movedTransIds = '105663806954';
        mockHttpService.postJson.mockResolvedValue(expectedTicketsModel);

        // Action and Assert
        const result = await appService.getTicketsDetail(new TicketDetailQuery());

        expect(result.totalItems).toBe(1);
        expect(result.licenseesName).toBe('MBC Group');
    });

    it('Update All Marked Tickets', async () => {
        // Arrange
        const expectedResult: ResultMarkTicketModel = {
            isSuccessful: true,
            errorCode: 0,
            errorMsg: ''
        };
        const testCases = [
            { errorCode: 0, errorMsg: 'Unmark tickets successfully!' },
            { errorCode: 100, errorMsg: 'Error!' },
        ];
        // Action and Assert
        for (const item of testCases) {
            expectedResult.errorCode = item.errorCode;
            expectedResult.errorMsg = item.errorMsg;
            mockHttpService.postJson.mockResolvedValue(expectedResult);
            const result = await appService.updateAllMarkedTickets(new AllMarkedTicketQuery());
            expect(result.errorMsg).toBe(item.errorMsg);
        }
    });

    it('#getDataForConfirmAutoUnmark should return expected data', async () => {
        // Arrange
        const fakeQuery = new ConfirmAutoUnmarkQuery();
        fakeQuery.matchId = '21';
        const fakeConfirmAutoUnmarkModel = new ConfirmAutoUnmarkViewModel();
        fakeConfirmAutoUnmarkModel.matchId = '11';
        const expected = new ConfirmAutoUnmarkViewModel();
        expected.totalItems = 20;
        mockHttpService.postJson.mockResolvedValue(expected);

        // Act
        const result = await appService.getDataForConfirmAutoUnmark(fakeQuery);

        // Assert
        expect(result).toBe(expected);
        expect(mockHttpService.postJson).toHaveBeenCalledTimes(1);
        expect(mockHttpService.postJson).toHaveBeenCalledWith(fakeQuery, 'api/MarkTickets/GetDataForConfirmAutoUnmark');
    });

    it('#updateConfirmAutoUnmark should return expected Result', async () => {
        // Arrange
        const fakeUpdateData = new UpdateConfirmAutoUnmark();
        fakeUpdateData.matchId = '12';
        const expected = new Result<null>();
        expected.isSuccessful = false;
        expected.errorMsg = 'error!!!';
        mockHttpService.postJson.mockResolvedValue(expected);

        // Act
        const result = await appService.updateConfirmAutoUnmark(fakeUpdateData);

        // Assert
        expect(result).toBe(expected);
        expect(mockHttpService.postJson).toHaveBeenCalledTimes(1);
        expect(mockHttpService.postJson).toHaveBeenCalledWith(fakeUpdateData, 'api/MarkTickets/UpdateConfirmAutoUnmark');
    });

    it('#getSportsType should return expected data', async () => {
        // Arrange
        const expected = new SportInfo();

        mockHttpService.getJson.mockResolvedValue(expected);
        // Act
        const result = await commonService.getSportsType();

        // Assert
        expect(result).toBe(expected);
        expect(mockHttpService.getJson).toHaveBeenCalledTimes(1);
        expect(mockHttpService.getJson).toHaveBeenCalledWith('api/SharedApi/GetSportsType');
    });
    
    it('#getDataPermission should return expected data', async () => {
        // Arrange
        const expected = new DataPermission();
        expected.isReadMarkTickets = true;

        mockHttpService.getJson.mockResolvedValue(expected);
        // Act
        const result = await appService.getDataPermission();

        // Assert
        expect(result).toBe(expected);
        expect(mockHttpService.getJson).toHaveBeenCalledTimes(1);
        expect(mockHttpService.getJson).toHaveBeenCalledWith('api/MarkTickets/GetDataPermission');
    });
});
