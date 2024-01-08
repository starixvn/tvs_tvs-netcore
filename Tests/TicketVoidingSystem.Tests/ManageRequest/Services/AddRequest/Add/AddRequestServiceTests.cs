using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class AddRequestServiceTests
{
    private readonly InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService;
    private readonly IMapper mapper;
    private readonly MarkTicketsService markTicketsService;
    private readonly IDynamicRepository repository;
    private readonly SendLetstalkAfterAddService sendLetstalkAfterAddService;
    private readonly AddRequestServiceImp service;
    private readonly SessionService sessionService;

    public AddRequestServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        repository = Substitute.For<IDynamicRepository>();
        sessionService = Substitute.For<SessionService>();
        var loggingService = Substitute.For<LoggingService>();
        markTicketsService = Substitute.For<MarkTicketsService>();
        var accountWinLostService = Substitute.For<AccountWinLostService>();
        insertAutoVoidRequestQueueService = Substitute.For<InsertAutoVoidRequestQueueService>();
        sendLetstalkAfterAddService = Substitute.For<SendLetstalkAfterAddService>();
        service = new AddRequestServiceImp(mapper, repository, sessionService, loggingService,
            markTicketsService, accountWinLostService, insertAutoVoidRequestQueueService, sendLetstalkAfterAddService);
    }

    [Fact]
    public async Task Execute_HasMarkTransIdsIsWhiteSpace_ReturnErrorCodeExpected()
    {
        // Arrange
        var query = new AddRequestQuery { MarkTransIds = "", IssueTypeId = 1 };

        // Act
        var actual = await service.Execute(query);

        // Assert
        Assert.Equal(1, actual.ErrorCode);
    }

    [Fact]
    public async Task Execute_HasIssueTypeIdIsArchivedTicket_ReturnErrorCodeExpected()
    {
        // Arrange
        var query = new AddRequestQuery { MarkTransIds = "123", IssueTypeId = 17 };

        // Act
        var actual = await service.Execute(query);

        // Assert
        Assert.Equal(1, actual.ErrorCode);
    }

    [Fact]
    public async Task Execute_NoHasResultSuccessful_ReturnExpected()
    {
        // Arrange
        var query = new AddRequestQuery { MarkTransIds = "1", IssueTypeId = 1 };
        var markTicketResults = new List<Result> { new() { ErrorCode = 1 } };
        markTicketsService.MarkTicketsInTVS("1", 1, MarkTypeConstant.ExecuteMarkTickets)
            .ReturnsForAnyArgs(markTicketResults);

        // Act
        var actual = await service.Execute(query);

        // Assert
        Assert.Equal(1, actual.ErrorCode);
    }

    [Theory]
    [InlineData(IssueTypeConstant.DangerAccepted, 1)]
    [InlineData(IssueTypeConstant.WrongHDP, 1)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, 1)]
    [InlineData(IssueTypeConstant.WrongOU, 1)]
    [InlineData(IssueTypeConstant.Wrong1stOU, 1)]
    [InlineData(IssueTypeConstant.RedCard, 1)]
    [InlineData(IssueTypeConstant.WrongOdds, 1)]
    [InlineData(IssueTypeConstant.ReducedOver, 1)]
    [InlineData(IssueTypeConstant.WrongScore, 1)]
    [InlineData(IssueTypeConstant.EarlyKickOffTime, 1)]
    [InlineData(IssueTypeConstant.WrongKickOffTime, 1)]
    [InlineData(IssueTypeConstant.AbnormalBetRealMember, 1)]
    [InlineData(IssueTypeConstant.AbnormalBet, 1)]
    [InlineData(IssueTypeConstant.DuplicateTickets, 1)]
    [InlineData(IssueTypeConstant.NotParticipate, 1)]
    [InlineData(IssueTypeConstant.AbnormalAccount, 1)]
    [InlineData(IssueTypeConstant.AbnormalAccount, ActionVoidRequestConstant.AutoVoidAllInstantWithPolicyId)]
    [InlineData(IssueTypeConstant.RecoverTicket, ActionVoidRequestConstant.AutoRecoverId)]
    [InlineData(1111111, 1)]
    public void Execute_HasResultSuccessful_CalledExpected(int issueTypeId, int actionId)
    {
        // Arrange
        var query = new AddRequestQuery
        {
            MarkTransIds = "1",
            IssueTypeId = issueTypeId,
            TransInfoJson = "123",
            MatchId = 1,
            OperatorsList = null,
            ActionId = actionId,
            AbnormalAccountInfo = issueTypeId.IsAbnormalAccount() ? new AbnormalAccountViewModel() : null
        };
        var markTicketResults = new List<Result> { new() { ErrorCode = 0 } };
        markTicketsService.MarkTicketsInTVS("1", 1, MarkTypeConstant.ExecuteMarkTickets)
            .ReturnsForAnyArgs(markTicketResults);
        mapper.Map<AddRequestCommand>(Arg.Any<AddRequestQuery>())
            .ReturnsForAnyArgs(new AddRequestCommand { RequestId = 12345 });
        sessionService.GetClientIp().ReturnsForAnyArgs("11");

        // Act
        _ = service.Execute(query);

        // Assert
        repository.Received(1).ExecuteAsync(Arg.Any<AddRequestCommand>());
        sessionService.Received(1).GetClientIp();
        insertAutoVoidRequestQueueService.Received(1).Execute(12345, actionId, null);
        sendLetstalkAfterAddService.Received(1).Execute(Arg.Any<AddRequestQuery>(), 12345);
    }

    [Fact]
    public void Execute_HasFullData_CalledExpected()
    {
        // Arrange
        var query = new AddRequestQuery
        {
            MarkTransIds = "1",
            IssueTypeId = 20,
            TransInfoJson = "123",
            MatchId = 1,
            ActionId = 1,
            OperatorsList = null,
            DuplicateTicketsInfo = new DuplicateTicketsViewModel { MatchId = 123 },
            WrongScoreInfo = new List<WrongScoreInfoViewModel>(),
            WrongHdpInfo = new List<WrongHdpViewModel>(),
            Wrong1stHdpInfo = new List<WrongHdpViewModel>(),
            WrongOuInfo = new List<WrongOuViewModel>(),
            Wrong1stOuInfo = new List<WrongOuViewModel>(),
            ReducedOverInfo = new List<ReducedOverViewModel>(),
            DangerAcceptedInfo = new List<DangerAcceptedViewModel>(),
            RedCardInfo = new List<DangerAcceptedViewModel>(),
            AbnormalAccountInfo = new AbnormalAccountViewModel(),
            WrongOddsInfo = new List<WrongOddsViewModel>(),
            EarlyKickOffInfo = new List<EarlyKickOffViewModel>(),
            NotParticipateInfo = new List<NotParticipateViewModel>(),
            RecoverTicketInfo = new RecoverTicketViewModel()
        };
        var markTicketResults = new List<Result> { new() { ErrorCode = 0 } };
        markTicketsService.MarkTicketsInTVS("1", 1, MarkTypeConstant.ExecuteMarkTickets)
            .ReturnsForAnyArgs(markTicketResults);
        mapper.Map<AddRequestCommand>(Arg.Any<AddRequestQuery>())
            .ReturnsForAnyArgs(new AddRequestCommand { RequestId = 12345 });
        sessionService.GetClientIp().ReturnsForAnyArgs("11");

        // Act
        _ = service.Execute(query);

        // Assert
        repository.Received(1).ExecuteAsync(Arg.Any<AddRequestCommand>());
        sessionService.Received(1).GetClientIp();
        insertAutoVoidRequestQueueService.Received(1).Execute(12345, 1, Arg.Any<IEnumerable<EarlyKickOffViewModel>>());
        sendLetstalkAfterAddService.Received(1).Execute(Arg.Any<AddRequestQuery>(), 12345);
    }
}