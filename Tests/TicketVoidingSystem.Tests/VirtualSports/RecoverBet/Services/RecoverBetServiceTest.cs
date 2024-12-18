using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Services;
using SpecialDelete.VirtualSports.RecoverBet.Services.GetTickets;
using SpecialDelete.VirtualSports.RecoverBet.Services.RecoverTickets;
using SpecialDelete.VirtualSports.RecoverBet.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Services;

public class RecoverBetServiceTest
{
    private static RecoverBetServiceImp CreateService(GetTicketsService getTicketsService)
    {
        var pagingService = Substitute.For<PagingService>();
        pagingService.Groups(Arg.Any<List<GetTicketModel>>(), ticket => ticket.GroupName)
            .ReturnsForAnyArgs(new List<Group<GetTicketModel>> { new() });
        var recoverTicketsService = Substitute.For<RecoverTicketsService>();
        var notificationService = Substitute.For<NotificationService>();
        var loggingService = Substitute.For<LoggingService>();
        return new RecoverBetServiceImp(
            getTicketsService,
            pagingService,
            recoverTicketsService,
            notificationService,
            loggingService);
    }

    [Fact]
    public async Task GetTickets_Successful_ReturnViewModel()
    {
        // Arrange
        var expected = new RecoverTicketsViewModel
        {
            Groups = [new Group<TicketViewModel>()]
        };
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var query = new Query { TicketType = "Single", Tickets = tickets };
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(new GetTicketsModel
        {
            Tickets = new List<RecoverTicketModel> { new() { DateTime = new DateTime() } },
            Validation = new GetTicketsValidation()
        });
        getTicketsService.AssignData(Arg.Any<Group<GetTicketModel>>(), query.TypeOfRecover)
            .ReturnsForAnyArgs(new Group<TicketViewModel>());
        var service = CreateService(getTicketsService);

        // Act
        var viewModel = await service.GetTickets(query);

        // Assert
        AssertExtension.Equal(expected, viewModel);
    }

    private static RecoverBetServiceImp CreateService(RecoverTicketsService recoverTicketsService)
    {
        var getTicketsService = Substitute.For<GetTicketsService>();
        var pagingService = Substitute.For<PagingService>();
        var notificationService = Substitute.For<NotificationService>();
        var loggingService = Substitute.For<LoggingService>();
        return new RecoverBetServiceImp(
            getTicketsService,
            pagingService,
            recoverTicketsService,
            notificationService,
            loggingService);
    }

    [Fact]
    public async Task RecoverTickets_ExecuteQueryFail_ReturnFailResult()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var query = new Query { TicketType = "Single", Tickets = tickets };
        var model = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel> { new() },
            Validation = new RecoverTicketsValidation
            {
                ErrorCode = 1,
                ErrorMsg = "Execute Query Fail"
            }
        };
        var expected = new List<Result>
        {
            new() { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg }
        };
        var recoverTicketsService = Substitute.For<RecoverTicketsService>();
        recoverTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(model);
        var notificationService = Substitute.For<NotificationService>();
        notificationService.WarningMessage("", "").ReturnsForAnyArgs([]);
        var service = CreateService(recoverTicketsService, notificationService);

        // Act
        var results = await service.RecoverTickets(query);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    [Fact]
    public async Task RecoverTickets_ExecuteQuerySuccess_RemoveMessage()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var query = new Query { TicketType = "Single", TransIds = "13465", MatchId = 123, Tickets = tickets };
        var model = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel> { new() },
            Validation = new RecoverTicketsValidation()
        };
        var recoverTicketsService = Substitute.For<RecoverTicketsService>();
        recoverTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(model);
        var notificationService = Substitute.For<NotificationService>();
        notificationService.WarningMessage("", "").ReturnsForAnyArgs([]);
        var service = CreateService(recoverTicketsService, notificationService);

        // Act
        await service.RecoverTickets(query);

        // Assert
        await recoverTicketsService.Received().ExecuteQuery(query);
    }

    [Fact]
    public async Task RecoverTickets_ExecuteQuerySuccess_DoNotContactUser()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var query = new Query { TicketType = "Single", TransIds = "13465", MatchId = 123, Tickets = tickets };
        var model = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel>(),
            Validation = new RecoverTicketsValidation()
        };
        var recoverTicketsService = Substitute.For<RecoverTicketsService>();
        recoverTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(model);
        var notificationService = Substitute.For<NotificationService>();
        notificationService.WarningMessage("", "").ReturnsForAnyArgs([]);
        var service = CreateService(recoverTicketsService, notificationService);

        // Act
        var actual = await service.RecoverTickets(query);

        // Assert
        Assert.True(!actual.Any());
    }

    [Fact]
    public async Task RecoverTickets_SendEmailThrowException_ReturnExceptionResult()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var query = new Query { TicketType = "Single", Tickets = tickets };
        var exception = new Exception("Send Email fail");
        var expected = new List<Result>
        {
            new() { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = exception.Message }
        };
        var model = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel> { new() },
            Validation = new RecoverTicketsValidation()
        };
        var recoverTicketsService = Substitute.For<RecoverTicketsService>();
        recoverTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(model);
        recoverTicketsService
            .When(x => x.SendEmail(Arg.Any<RecoverTicketsModel>(), query.TypeOfRecover))
            .Do(_ => throw exception);
        var service = CreateService(recoverTicketsService);

        // Act
        var results = await service.RecoverTickets(query);

        // Assert
        AssertExtension.Equal(expected, results);
    }

    private static RecoverBetServiceImp CreateService(
        RecoverTicketsService recoverTicketsService,
        LoggingService loggingService)
    {
        var getTicketsService = Substitute.For<GetTicketsService>();
        var pagingService = Substitute.For<PagingService>();
        var notificationService = Substitute.For<NotificationService>();
        return new RecoverBetServiceImp(
            getTicketsService,
            pagingService,
            recoverTicketsService,
            notificationService,
            loggingService);
    }

    [Fact]
    public async Task RecoverTickets_SendEmailThrowException_WriteLog()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var model = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel> { new() },
            Validation = new RecoverTicketsValidation()
        };
        var query = new Query { TicketType = "Single", Tickets = tickets };
        var exception = new Exception("Send Email fail");
        var recoverTicketsService = Substitute.For<RecoverTicketsService>();
        recoverTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(model);
        recoverTicketsService.When(x => x.SendEmail(Arg.Any<RecoverTicketsModel>(), query.TypeOfRecover))
            .Do(_ => throw exception);
        var loggingService = Substitute.For<LoggingService>();
        var service = CreateService(recoverTicketsService, loggingService);

        // Act
        await service.RecoverTickets(query);

        // Assert
        await loggingService.Received().ErrorAsync(exception);
    }

    private static RecoverBetServiceImp CreateService(
        RecoverTicketsService recoverTicketsService,
        NotificationService notificationService)
    {
        var getTicketsService = Substitute.For<GetTicketsService>();
        var pagingService = Substitute.For<PagingService>();
        var loggingService = Substitute.For<LoggingService>();
        return new RecoverBetServiceImp(
            getTicketsService,
            pagingService,
            recoverTicketsService,
            notificationService,
            loggingService);
    }

    [Fact]
    public async Task CreateMessage_RecoverSingleTicket_CreateWithCompletedMatchIds()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1  },
            new() { TransId = "125", SiteDbGroupId = 0  }
        };
        var query = new Query { TicketType = "Single", Tickets = tickets };
        var model = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel> { new() },
            Validation = new RecoverTicketsValidation
            {
                CompletedMatchIds = "1111",
                ReCalculatedMainTransIds = ""
            }
        };
        var format = StringResource.WarningAutoReSettleMatchs;
        var recoverTicketsService = Substitute.For<RecoverTicketsService>();
        recoverTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(model);
        var notificationService = Substitute.For<NotificationService>();
        notificationService.WarningMessage("", "").ReturnsForAnyArgs([]);
        var service = CreateService(recoverTicketsService, notificationService);

        // Act
        await service.RecoverTickets(query);

        // Assert
        notificationService.Received().WarningMessage(format, model.Validation.CompletedMatchIds);
    }

    [Fact]
    public async Task CreateMessage_RecoverSubParlayTicket_CreateWithCompletedMatchIds()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1  },
            new() { TransId = "125", SiteDbGroupId = 0  }
        };
        var query = new Query { TicketType = "Mix Parlay", Type = "Sub", Tickets = tickets };
        var model = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel> { new() },
            Validation = new RecoverTicketsValidation
            {
                CompletedMatchIds = "1111",
                ReCalculatedMainTransIds = ""
            }
        };
        var format = StringResource.WarningAutoReSettleTransIdsOfMatch;
        var recoverTicketsService = Substitute.For<RecoverTicketsService>();
        recoverTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(model);
        var notificationService = Substitute.For<NotificationService>();
        notificationService.WarningMessage("", "").ReturnsForAnyArgs([]);
        var service = CreateService(recoverTicketsService, notificationService);

        // Act
        await service.RecoverTickets(query);

        // Assert
        notificationService.Received().WarningMessage(format, model.Validation.ReCalculatedMainTransIds);
    }

    [Fact]
    public async Task CreateMessage_RecoverMainParlayTicket_CreateWithCompletedMatchIds()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1  },
            new() { TransId = "125", SiteDbGroupId = 0  }
        };
        var query = new Query { TicketType = "Mix Parlay", Type = "Main", Tickets = tickets };
        var model = new RecoverTicketsModel
        {
            Tickets = new List<RecoverTicketModel> { new() },
            Validation = new RecoverTicketsValidation
            {
                CompletedMatchIds = "1111",
                ReCalculatedMainTransIds = "2222"
            }
        };
        var format = StringResource.WarningAutoReSettleTransIds;
        var recoverTicketsService = Substitute.For<RecoverTicketsService>();
        var notificationService = Substitute.For<NotificationService>();
        notificationService.WarningMessage("", "").ReturnsForAnyArgs([]);
        recoverTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(model);
        var service = CreateService(recoverTicketsService, notificationService);

        // Act
        await service.RecoverTickets(query);

        // Assert
        notificationService.Received().WarningMessage(format, model.Validation.ReCalculatedMainTransIds);
    }
}