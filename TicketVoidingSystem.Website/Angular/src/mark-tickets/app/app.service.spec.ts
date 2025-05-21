import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../utility/modules/testing.module';
import { BetType, GetBetTypesQuery, GroupBetType, GroupBetTypesModel } from '../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BalanceUp } from '../../utility/models/balance-up.model';
import { SportInfo } from '../../utility/models/event.model';
import { Result } from '../../utility/models/result';
import { CommonService } from '../../utility/services/common.service';
import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import { ConfirmAutoUnmarkQuery, ConfirmAutoUnmarkViewModel, UpdateConfirmAutoUnmark } from './confirm-auto-unmark/confirm-auto-unmark.model';
import { AllMarkedTicketsModel } from './mark-unmark-ticket/all-marked-ticket-list/all-marked-ticket.model';
import { AllMarkedTicketQuery, GetLogsQuery, GetTicketsQuery, MarkedTicketQuery, TicketDetailQuery } from './models/query.model';
import { DataPermission, ResultMarkTicketModel } from './models/result.model';
import { GroupModel } from './tickets-list/group-tickets.model';
import { TicketModel } from './tickets-list/ticket.model';
import { TicketsModel } from './tickets-list/tickets.model';
import { LogsModel } from './user-log/logs-list/logs-list.model';

class Helper {
    static readonly fakeBalanceUp: BalanceUp = {
        balanceUpDay: new Date(),
        moveBetsDay: new Date()
    };

    static readonly fakeGroupBettypes: GroupBetType[] = [
        new GroupBetType('1H', [new BetType(15, '1H 1X2', false, 0, true)], true),
        new GroupBetType('FT', [new BetType(4, 'Correct Score', false, 0, true)], true),
    ];

    static readonly fakeTicketsModel = {
        groups: [new GroupModel('MBC Group', [{ mainTransId: '123123123' } as TicketModel], ['12'])],
        totalItems: 1,
        licenseesName: 'MBC Group',
        invalidTransIds: '105662749481',
        movedTransIds: '105663806954'
    } as TicketsModel;

    static readonly fakeAllMarkedTicketsModel: AllMarkedTicketsModel = {
        ticketList: [
            {
                no: 1,
                total: 227,
                createdDate: new Date(),
                matchId: '28321695',
                kickOffTime: new Date(),
                htScore: '',
                ftScore: '',
                userId: 8,
                username: 'sa',
                isChecked: true,
                event: ''
            }
        ],
        totalItems: 1
    };

    static readonly fakeLogsModel: LogsModel = {
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

    static readonly fakeResultMarkTicketModel: ResultMarkTicketModel = {
        isSuccessful: true,
        errorCode: 0,
        errorMsg: ''
    };

    static readonly fakeConfirmAutoUnmarkViewModel = {
        matchId: '11',
        totalItems: 20
    } as ConfirmAutoUnmarkViewModel;

    static readonly fakeSportInfo: SportInfo = new SportInfo();

    static readonly fakeDataPermission = {
        isReadMarkTickets: true
    } as DataPermission;
}

jest.mock('../../utility/services/http.service');

describe('AppService', () => {
    let httpService: jest.Mocked<HttpService>;
    let appService: AppService;
    let commonService: CommonService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestingModule],
            providers: [AppService, CommonService, HttpService]
        });
        httpService = TestBed.inject(HttpService) as jest.Mocked<HttpService>;
        appService = TestBed.inject(AppService);
        commonService = TestBed.inject(CommonService);
    });

    describe('CommonService', () => {
        it('#getBalanceUp should return expected data', async () => {
            // Arrange
            httpService.getJson.mockResolvedValue(Helper.fakeBalanceUp);

            // Act
            const result = await commonService.getBalanceUp();

            // Assert
            expect(result).toStrictEqual(Helper.fakeBalanceUp);
            expect(httpService.getJson).toHaveBeenCalledTimes(1);
        });

        it('#getGroupBetTypes should return expected data', async () => {
            // Arrange
            const expectedGroupBettypesModel = new GroupBetTypesModel(Helper.fakeGroupBettypes, true);
            httpService.postJson.mockResolvedValue(expectedGroupBettypesModel);

            // Act
            const result = await commonService.getGroupBetTypes(new GetBetTypesQuery());

            // Assert
            expect(result).toStrictEqual(expectedGroupBettypesModel);
            expect(result.groupBetTypes.length).toBe(2);
            expect(result.groupBetTypes[0].groupName).toBe('1H');
            expect(httpService.postJson).toHaveBeenCalledTimes(1);
        });

        it('#getSportsType should return expected data', async () => {
            // Arrange
            httpService.getJson.mockResolvedValue(Helper.fakeSportInfo);

            // Act
            const result = await commonService.getSportsType();

            // Assert
            expect(result).toBe(Helper.fakeSportInfo);
            expect(httpService.getJson).toHaveBeenCalledTimes(1);
            expect(httpService.getJson).toHaveBeenCalledWith('api/SharedApi/GetSportsType');
        });
    });

    describe('AppService', () => {
        it('#getTickets should return expected data', async () => {
            // Arrange
            httpService.postJson.mockResolvedValue(Helper.fakeTicketsModel);

            // Act
            const result = await appService.getTickets(new GetTicketsQuery());

            // Assert
            expect(result).toStrictEqual(Helper.fakeTicketsModel);
            expect(result.totalItems).toBe(1);
            expect(result.licenseesName).toBe('MBC Group');
            expect(httpService.postJson).toHaveBeenCalledTimes(1);
        });

        it('#getAllMakerdTickets should return expected data', async () => {
            // Arrange
            httpService.postJson.mockResolvedValue(Helper.fakeAllMarkedTicketsModel);

            // Act
            const result = await appService.getAllMakerdTickets(new GetTicketsQuery());

            // Assert
            expect(result).toStrictEqual(Helper.fakeAllMarkedTicketsModel);
            expect(result.totalItems).toBe(1);
            expect(result.ticketList.length).toBe(1);
            expect(httpService.postJson).toHaveBeenCalledTimes(1);
        });

        it('#getUserLogs should return expected data', async () => {
            // Arrange
            httpService.postJson.mockResolvedValue(Helper.fakeLogsModel);

            // Act
            const result = await appService.getUserLogs(new GetLogsQuery());

            // Assert
            expect(result).toStrictEqual(Helper.fakeLogsModel);
            expect(result.totalLogs).toBe(1);
            expect(result.logList.length).toBe(1);
            expect(httpService.postJson).toHaveBeenCalledTimes(1);
        });

        it('#exportExcel should handle file download', async () => {
            // Arrange
            const query = new GetTicketsQuery();
            const url = `api/MarkTickets/ExportExcel`;
            httpService.downloadFile.mockResolvedValue();

            // Act
            const result = await appService.exportExcel(query);

            // Assert
            expect(result).toBeUndefined();
            expect(httpService.downloadFile).toHaveBeenCalledTimes(1);
            expect(httpService.downloadFile).toHaveBeenCalledWith(query, url);
        });

        it('#exportExcelDetailTickets should handle file download', async () => {
            // Arrange
            const query = new TicketDetailQuery();
            const url = `api/MarkTickets/ExportExcelDetailTicket`;
            httpService.downloadFile.mockResolvedValue();

            // Act
            const result = await appService.exportExcelDetailTickets(query);

            // Assert
            expect(result).toBeUndefined();
            expect(httpService.downloadFile).toHaveBeenCalledTimes(1);
            expect(httpService.downloadFile).toHaveBeenCalledWith(query, url);
        });

        it('#updateMarkedTicket should handle success case', async () => {
            // Arrange
            const query: MarkedTicketQuery = {
                tickets: [],
                status: '0',
                checkPermissionTickets: []
            };
            const expectedResult = {
                isSuccessful: true,
                errorCode: 0,
                errorMsg: 'Mark tickets successfully!'
            } as ResultMarkTicketModel;
            httpService.postJson.mockResolvedValue(expectedResult);

            // Act
            const result = await appService.updateMarkedTicket(query);

            // Assert
            expect(result.isSuccessful).toBe(true);
            expect(result.errorMsg).toBe('Mark tickets successfully!');
            expect(httpService.postJson).toHaveBeenCalledTimes(1);
        });

        it('#getTicketsDetail should return expected data', async () => {
            // Arrange
            httpService.postJson.mockResolvedValue(Helper.fakeTicketsModel);

            // Act
            const result = await appService.getTicketsDetail(new TicketDetailQuery());

            // Assert
            expect(result).toStrictEqual(Helper.fakeTicketsModel);
            expect(result.totalItems).toBe(1);
            expect(result.licenseesName).toBe('MBC Group');
            expect(httpService.postJson).toHaveBeenCalledTimes(1);
        });

        it('#updateAllMarkedTickets should handle success case', async () => {
            // Arrange
            const expectedResult = { ...Helper.fakeResultMarkTicketModel };
            httpService.postJson.mockResolvedValue(expectedResult);

            // Act
            const result = await appService.updateAllMarkedTickets(new AllMarkedTicketQuery());

            // Assert
            expect(result).toStrictEqual(expectedResult);
            expect(result.isSuccessful).toBe(true);
            expect(result.errorMsg).toBe('Unmark tickets successfully!');
            expect(httpService.postJson).toHaveBeenCalledTimes(1);
        });

        it('#getDataForConfirmAutoUnmark should return expected data', async () => {
            // Arrange
            const fakeQuery = new ConfirmAutoUnmarkQuery();
            fakeQuery.matchId = '21';
            httpService.postJson.mockResolvedValue(Helper.fakeConfirmAutoUnmarkViewModel);

            // Act
            const result = await appService.getDataForConfirmAutoUnmark(fakeQuery);

            // Assert
            expect(result).toStrictEqual(Helper.fakeConfirmAutoUnmarkViewModel);
            expect(httpService.postJson).toHaveBeenCalledTimes(1);
            expect(httpService.postJson).toHaveBeenCalledWith(fakeQuery, 'api/MarkTickets/GetDataForConfirmAutoUnmark');
        });

        it('#updateConfirmAutoUnmark should handle success case', async () => {
            // Arrange
            const fakeUpdateData = new UpdateConfirmAutoUnmark();
            fakeUpdateData.matchId = '12';
            const expected = new Result<null>();
            expected.isSuccessful = false;
            expected.errorMsg = 'error!!!';
            httpService.postJson.mockResolvedValue(expected);

            // Act
            const result = await appService.updateConfirmAutoUnmark(fakeUpdateData);

            // Assert
            expect(result).toStrictEqual(expected);
            expect(httpService.postJson).toHaveBeenCalledTimes(1);
            expect(httpService.postJson).toHaveBeenCalledWith(fakeUpdateData, 'api/MarkTickets/UpdateConfirmAutoUnmark');
        });

        it('#getDataPermission should return expected data', async () => {
            // Arrange
            httpService.getJson.mockResolvedValue(Helper.fakeDataPermission);

            // Act
            const result = await appService.getDataPermission();

            // Assert
            expect(result).toStrictEqual(Helper.fakeDataPermission);
            expect(httpService.getJson).toHaveBeenCalledTimes(1);
            expect(httpService.getJson).toHaveBeenCalledWith('api/MarkTickets/GetDataPermission');
        });

        it('#getDataPermission should handle error case', async () => {
            // Arrange
            const error = new Error('API Error');
            httpService.getJson.mockRejectedValue(error);

            // Act & Assert
            await expect(appService.getDataPermission()).rejects.toThrow('API Error');
            expect(httpService.getJson).toHaveBeenCalledWith('api/MarkTickets/GetDataPermission');
        });
    });
});
