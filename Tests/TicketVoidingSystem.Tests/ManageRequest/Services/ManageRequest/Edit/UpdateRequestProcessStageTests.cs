using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.Edit;

public class UpdateRequestProcessStageTests
{
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;
    private readonly AccountWinLostService accountWinLostService;
    private readonly GetUpdateResultService getUpdateResultService;
    private readonly CompressDataService compressDataService;
    private readonly UpdateRequestProcessStageImp service;

    public UpdateRequestProcessStageTests()
    {
        mapper = Substitute.For<IMapper>();
        sessionService = Substitute.For<SessionService>();
        repository = Substitute.For<IDynamicRepository>();
        accountWinLostService = Substitute.For<AccountWinLostService>();
        loggingService = Substitute.For<LoggingService>();
        var insertAutoVoidRequestQueueService = Substitute.For<InsertAutoVoidRequestQueueService>();
        getUpdateResultService = Substitute.For<GetUpdateResultService>();
        compressDataService = Substitute.For<CompressDataService>();
        service = new UpdateRequestProcessStageImp(mapper, repository, loggingService, accountWinLostService, sessionService,
            insertAutoVoidRequestQueueService, getUpdateResultService, compressDataService);
    }

    [Fact]
    public async Task Execute_HasErrorEditRequest_CalledExpected()
    {
        // Arrange
        var query = new EditRequestQuery
        {
            RequestId = 1,
            ActionId = 1,
            MatchId = 1,
            WrongMarketOfferedInfo = [new WrongMarketOfferedViewModel
            {
                BetTypeCount = new List<BetTypeTicketsInfo>(),
                FilterFromTransTime = DateTime.Today,
                FilterToTransTime = DateTime.Today,
                LogInfoDetail = new LogInfoDetail
                {
                    VoidFromTime = DateTime.Today,
                    VoidToTime = DateTime.Today
                }
            }],
            IssueTypeId = IssueTypeConstant.WrongMarketOffered
        };
        var markedTicketsSuccessful = new List<long> { 1, 2 };
        mapper.Map<EditRequestCommand>(query).Returns(new EditRequestCommand());
        sessionService.GetClientIp().Returns("127:00:42");
        var e = new Exception();
        repository.ExecuteAsync(Arg.Any<EditRequestCommand>()).Throws(e);
        getUpdateResultService.CreateErrorResult(e, markedTicketsSuccessful).Returns(new Result());

        // Act
        await service.Execute(query, markedTicketsSuccessful);

        // Assert
        await loggingService.Received(1).ErrorAsync(e);
        getUpdateResultService.Received(1).CreateErrorResult(e, markedTicketsSuccessful);
    }

    [Fact]
    public async Task Execute_IsAbnormalAccountHasValidData_CalledExpected()
    {
        // Arrange
        var query = new EditRequestQuery
        {
            RequestId = 1,
            ActionId = 1,
            MatchId = 1,
            AbnormalAccountInfo = new AbnormalAccountViewModel
            {
                AccountWinlostModels = new List<AccountWinlostModel>()
            },
            IssueTypeId = IssueTypeConstant.AbnormalAccount
        };
        var markedTicketsSuccessful = new List<long> { 1, 2 };
        mapper.Map<EditRequestCommand>(query).Returns(new EditRequestCommand());
        sessionService.GetClientIp().Returns("127:00:42");
        getUpdateResultService.CreateSuccessResult(query.RequestId, query.MatchId.ToString(), markedTicketsSuccessful)
            .Returns(new Result());

        // Act
        await service.Execute(query, markedTicketsSuccessful);

        // Assert
        await accountWinLostService.Received(1).SaveAccountWinLost(Arg.Any<int>(), query.ActionId, query.AbnormalAccountInfo.AccountWinlostModels);
        getUpdateResultService.Received(1).CreateSuccessResult(query.RequestId, query.MatchId.ToString(), markedTicketsSuccessful);
    }
}