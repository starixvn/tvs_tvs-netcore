using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Notification;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.Edit;

public class UpdateRequestProcessStageTests
{
    private readonly IMapper mapper;
    private readonly SessionService sessionService;
    private readonly AccountWinLostService accountWinLostService;
    private readonly GetUpdateResultService getUpdateResultService;
    private readonly PendingMarkTicketsService pendingMarkTicketsService;
    private readonly UpdateRequestProcessStageImp service;

    public UpdateRequestProcessStageTests()
    {
        mapper = Substitute.For<IMapper>();
        sessionService = Substitute.For<SessionService>();
        var repository = Substitute.For<IDynamicRepository>();
        accountWinLostService = Substitute.For<AccountWinLostService>();
        var notificationService = Substitute.For<NotificationService>();
        var insertAutoVoidRequestQueueService = Substitute.For<InsertAutoVoidRequestQueueService>();
        getUpdateResultService = Substitute.For<GetUpdateResultService>();
        var compressDataService = Substitute.For<CompressDataService>();
        pendingMarkTicketsService = Substitute.For<PendingMarkTicketsService>();
        service = new UpdateRequestProcessStageImp(mapper, repository, accountWinLostService, sessionService,
            insertAutoVoidRequestQueueService, getUpdateResultService, compressDataService, notificationService, pendingMarkTicketsService);
    }

    [Fact]
    public async Task Execute_IsAbnormalAccountHasValidData_CalledExpected()
    {
        // Arrange
        var query = new EditRequestQuery
        {
            RequestId = 1,
            ActionId = ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId,
            MatchId = 1,
            AbnormalAccountInfo = new AbnormalAccountViewModel
            {
                AccountWinlostModels = new List<AccountWinlostModel>()
            },
            IssueTypeId = IssueTypeConstant.AbnormalAccount,
            SiteDBDownInfoJson = "test-site-db-down-info"
        };
        var markedTicketsSuccessful = new List<long> { 1, 2 };
        mapper.Map<EditRequestCommand>(query).Returns(new EditRequestCommand());
        sessionService.GetClientIp().Returns("127:00:42");
        getUpdateResultService.CreateSuccessResult(query.RequestId, query.MatchId.ToString())
            .Returns(new Result());

        // Act
        await service.Execute(query);

        // Assert
        await accountWinLostService.Received(1).SaveAccountWinLost(Arg.Any<int>(), query.ActionId, query.AbnormalAccountInfo.AccountWinlostModels);
        await pendingMarkTicketsService.Received(1).PendingMarkTickets(query.RequestId, query.SiteDBDownInfoJson, query.ActionId, true);
        getUpdateResultService.Received(1).CreateSuccessResult(query.RequestId, query.MatchId.ToString());
    }
}