using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByBetId.Handlers;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.NetPosition;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Handlers;

[Category("VoidByBetId")]
public class VoidTicketsRequestTest
{
    private NetPositionService netPositionService;
    private HandleService handleService;
    private LoggingService loggingService;
    private ResultCacheService resultCacheService;
    private CashOutApiService cashOutApiService;
    private AfterVoidService afterVoidService;

    private VoidTicketsHandler CreateHandler()
    {
        netPositionService = Substitute.For<NetPositionService>();
        handleService = Substitute.For<HandleService>();
        loggingService = Substitute.For<LoggingService>();
        cashOutApiService = Substitute.For<CashOutApiService>();
        resultCacheService = Substitute.For<ResultCacheService>();
        afterVoidService = Substitute.For<AfterVoidService>();
        return new VoidTicketsHandler(
            netPositionService,
            handleService,
            loggingService,
            resultCacheService,
            cashOutApiService,
            afterVoidService);
    }

    [Fact]
    public async Task VoidTickets_IsExistResult_ReturnNull()
    {
        // Arrange
        var handler = CreateHandler();
        resultCacheService.IsExistResult("1").ReturnsForAnyArgs(true);
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var query = new VoidTicketsRequest
        {
            Tickets = tickets,
            TransIdCrickets = tickets,
            Match = new Match { SportType = 207, HomeId = 1, AwayId = 1 },
            IsFilterByBetId = true,
            Guid = "1"
        };
        handleService.VoidTickets(Arg.Any<VoidTicketsRequest>())
            .ReturnsForAnyArgs(new VoidTicketsModel
            {
                Validation = new VoidTicketValidation(),
                Tickets = new List<TicketEmailModel> { new() }
            });

        // Act
        var actual = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Null(actual);
    }

    [Fact]
    public async Task VoidTickets_HasOnlyCricketTicket_HasErrorExpected()
    {
        // Arrange
        var handler = CreateHandler();
        resultCacheService.IsExistResult("1").ReturnsForAnyArgs(false);
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 }
        };
        var query = new VoidTicketsRequest
        {
            Tickets = tickets,
            TransIdCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } },
            IsFilterByBetId = true
        };
        netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(false);

        // Act
        var actual = await handler.Handle(query, CancellationToken.None);

        // Assert
        AssertExtension.Equal(ErrorCode.ExecuteQueryAPIFail, actual[0].ErrorCode);
    }

    [Fact]
    public async Task VoidTickets_HasVoidTickets_CalledExpected()
    {
        // Arrange
        var handler = CreateHandler();
        resultCacheService.IsExistResult("1").ReturnsForAnyArgs(false);
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var ticketEmailModels = new List<TicketEmailModel>
        {
            new() { TransId = 124},
            new() { TransId = 125}
        };

        var query = new VoidTicketsRequest
        {
            Tickets = tickets,
            TransIdCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } },
            IsFilterByBetId = true
        };

        handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
        afterVoidService.SendEmail(Arg.Any<VoidTicketsQuery>(), Arg.Any<IEnumerable<TicketEmailModel>>()).ReturnsForAnyArgs(new List<Result>());
        afterVoidService.SendLetstalk(Arg.Any<VoidTicketsQuery>(), Arg.Any<VoidTicketsModel>()).ReturnsForAnyArgs(new List<Result>());
        netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(false);
        handleService.VoidTickets(Arg.Any<VoidTicketsQuery>()).ReturnsForAnyArgs(new VoidTicketsModel
        {
            Tickets = ticketEmailModels,
            Validation = new VoidTicketValidation { ErrorCode = 1, ErrorMsg = "a" }
        });

        // Act
        _ = await handler.Handle(query, CancellationToken.None);

        // Assert
        handleService.Received(1).CreateWarningMessage(Arg.Any<string>());
        await afterVoidService.Received(1).SendMessage(Arg.Any<VoidTicketsQuery>(), Arg.Any<IEnumerable<TicketEmailModel>>());
        await afterVoidService.Received(1).SendEmail(Arg.Any<VoidTicketsQuery>(), Arg.Any<IEnumerable<TicketEmailModel>>());
        await afterVoidService.Received(1).SendLetstalk(Arg.Any<VoidTicketsQuery>(), Arg.Any<VoidTicketsModel>());
        await cashOutApiService.Received(1).VoidBetForCashOutBasketball(Arg.Any<IEnumerable<TicketEmailModel>>());
        await netPositionService.Received(1).RollBackNetPosition(Arg.Any<IEnumerable<BetId>>());
    }
}