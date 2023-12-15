using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
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
    private readonly AccountWinLostService accountWinLostService;
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
        accountWinLostService = Substitute.For<AccountWinLostService>();
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
    [InlineData(IssueTypeConstant.DangerAccepted)]
    [InlineData(IssueTypeConstant.WrongHDP)]
    [InlineData(IssueTypeConstant.Wrong1stHDP)]
    [InlineData(IssueTypeConstant.WrongOU)]
    [InlineData(IssueTypeConstant.Wrong1stOU)]
    [InlineData(IssueTypeConstant.RedCard)]
    [InlineData(IssueTypeConstant.WrongOdds)]
    [InlineData(IssueTypeConstant.ReducedOver)]
    [InlineData(IssueTypeConstant.WrongScore)]
    [InlineData(IssueTypeConstant.EarlyKickOffTime)]
    [InlineData(IssueTypeConstant.WrongKickOffTime)]
    [InlineData(IssueTypeConstant.AbnormalBetRealMember)]
    [InlineData(IssueTypeConstant.AbnormalBet)]
    [InlineData(IssueTypeConstant.DuplicateTickets)]
    [InlineData(IssueTypeConstant.NotParticipate)]
    [InlineData(1111111)]
    public void Execute_HasResultSuccessful_CalledExpected(int issueTypeId)
    {
        // Arrange
        var query = new AddRequestQuery
        {
            MarkTransIds = "1",
            IssueTypeId = issueTypeId,
            TransInfoJson = "123",
            MatchId = 1,
            ActionId = 1,
            OperatorsList = null
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
        insertAutoVoidRequestQueueService.Received(1).Execute(12345, 1, null);
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
            NotParticipateInfo = new List<NotParticipateViewModel>()
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