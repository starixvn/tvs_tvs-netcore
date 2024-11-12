using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services;
using SpecialDelete.VoidByCurrency.Services.GetTickets;
using SpecialDelete.VoidByCurrency.Services.VoidTickets;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.Letstalk;
using TicketVoidingSystem.Services.NetPosition;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services;

public class VoidByCurrencyServiceTest
{
    private readonly GetTicketsService getTicketsService;
    private readonly LoggingService loggingService;
    private readonly VoidTicketsService voidTicketsService;
    private readonly NetPositionService netPositionService;
    private readonly PagingService pagingService;
    private readonly VoidByCurrencyServiceImp service;

    public VoidByCurrencyServiceTest()
    {
        loggingService = Substitute.For<LoggingService>();
        getTicketsService = Substitute.For<GetTicketsService>();
        voidTicketsService = Substitute.For<VoidTicketsService>();
        netPositionService = Substitute.For<NetPositionService>();
        pagingService = Substitute.For<PagingService>();
        var notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        var cashOutApiService = Substitute.For<CashOutApiService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<TicketInfoForLetstalk>(null).ReturnsForAnyArgs(new TicketInfoForLetstalk());
        service = new VoidByCurrencyServiceImp(
            mapper,
            getTicketsService,
            loggingService,
            voidTicketsService,
            netPositionService,
            pagingService,
            notificationLetstalkService,
            cashOutApiService);
    }

    [Fact]
    public async Task GetTickets_SuccessfullyGetTicketsService_ReturnViewModel()
    {
        // Arrange
        var dateTime = DateTimeOffset.Now.DateTime;
        var expected = new TicketsViewModel
        {
            Groups = [new() { Name = "Test" }],
            TotalItems = 1,
            FromTransTime = dateTime.ZoneManila(),
            ToTransTime = dateTime.ZoneManila()
        };
        var tickets = new List<GetTicketModel>
        {
            new() { TransDate = dateTime }
        };
        var query = new GetTicketsQuery { IsOutright = true };
        var groupViewModel = new Group<TicketViewModel> { Name = "Test" };
        var groups = new List<Group<GetTicketModel>> { new() { Name = "Test" } };
        getTicketsService.GetTickets(Arg.Any<GetTicketsQuery>())
            .ReturnsForAnyArgs(tickets);
        getTicketsService.AssignData(new Group<GetTicketModel>(), true)
            .ReturnsForAnyArgs(groupViewModel);
        pagingService.Groups(Arg.Any<List<GetTicketModel>>(), ticket => ticket.GroupName).ReturnsForAnyArgs(groups);

        // Act
        var viewModel = await service.GetTickets(query);

        // Assert
        AssertExtension.Equal(expected, viewModel);
    }

    [Fact]
    public async Task GetTickets_SuccessfullyGetTicketsService_DoNotUpdateTimeViewModel()
    {
        // Arrange
        var groupViewModel = new Group<TicketViewModel> { Name = "Test" };
        var groups = new List<Group<GetTicketModel>> { new() { Name = "Test" } };
        getTicketsService.GetTickets(new GetTicketsQuery())
            .ReturnsForAnyArgs(new List<GetTicketModel>());
        getTicketsService.AssignData(new Group<GetTicketModel>(), true)
            .ReturnsForAnyArgs(groupViewModel);
        pagingService.Groups(Arg.Any<List<GetTicketModel>>(), ticket => ticket.GroupName).ReturnsForAnyArgs(groups);

        var expected = new TicketsViewModel
        {
            Groups = [new() { Name = "Test" }],
            TotalItems = 0
        };

        // Act
        var viewModel = await service.GetTickets(new GetTicketsQuery());

        // Assert
        AssertExtension.Equal(expected, viewModel);
    }

    [Fact]
    public async Task VoidBet_UpdateNetPositionFail_CreateMessageFailApiCricket()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var query = new VoidTicketsQuery
        {
            Tickets = tickets,
            CricketTransIds = tickets,
            TicketType = ""
        };
        netPositionService.UpdateNetPosition(query.CricketTransIds, "").ReturnsForAnyArgs(false);
        voidTicketsService.ExecuteQuery(Arg.Any<VoidTicketsQuery>())
            .ReturnsForAnyArgs(new VoidTicketsModel
            {
                Validation = new VoidTicketsValidation(),
                Tickets = new List<TicketEmailModel>()
            });

        // Act
        var actual = await service.VoidBet(query);

        // Assert
        Assert.Equal(ErrorCode.ExecuteQueryAPIFail, actual.First().ErrorCode);
    }

    [Fact]
    public async Task VoidTickets_FailUpdateNetPositionAndTransIdsIsCricketTransIds_ReturnMessageCricket()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            CricketTransIds = new List<BetId> { new() { TransId = "123" } },
            Tickets = new List<BetId>()
        };
        netPositionService.UpdateNetPosition(query.CricketTransIds, "").ReturnsForAnyArgs(false);
        voidTicketsService.ExecuteQuery(Arg.Any<VoidTicketsQuery>())
            .ReturnsForAnyArgs(new VoidTicketsModel
            {
                Validation = new VoidTicketsValidation(),
                Tickets = new List<TicketEmailModel>()
            });

        // Act
        var actual = await service.VoidBet(query);

        // Assert
        Assert.Equal(ErrorCode.ExecuteQueryAPIFail, actual.First().ErrorCode);
    }

    [Fact]
    public async Task VoidTickets_FailUpdateNetPositionAndValidTransIdsAfterRemoveCricket_ExecuteQuery()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var query = new VoidTicketsQuery
        { CricketTransIds = new List<BetId> { new() { TransId = "123" } }, Tickets = tickets };
        voidTicketsService.ExecuteQuery(Arg.Any<VoidTicketsQuery>())
            .ReturnsForAnyArgs(new VoidTicketsModel
            {
                Validation = new VoidTicketsValidation(),
                Tickets = new List<TicketEmailModel>()
            });
        netPositionService.UpdateNetPosition(query.CricketTransIds, "").ReturnsForAnyArgs(false);

        // Act
        await service.VoidBet(query);

        // Assert
        await voidTicketsService
            .Received()
            .ExecuteQuery(query);
    }

    [Fact]
    public async Task VoidTickets_FailUpdateNetPositionAndValidTransIdsAfterRemoveCricket_AddMessageCricket()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var query = new VoidTicketsQuery
        { CricketTransIds = new List<BetId> { new() { TransId = "123" } }, Tickets = tickets };
        netPositionService.UpdateNetPosition(query.CricketTransIds, "").ReturnsForAnyArgs(false);
        voidTicketsService.ExecuteQuery(query)
            .ReturnsForAnyArgs(new VoidTicketsModel
            {
                Validation = new VoidTicketsValidation(),
                Tickets = new List<TicketEmailModel> { new() }
            });
        voidTicketsService.SendEmail(query, Arg.Any<VoidTicketsModel>())
            .ReturnsForAnyArgs(new List<Result>());

        // Act
        var actual = await service.VoidBet(query);

        // Assert
        Assert.Equal(ErrorCode.ExecuteQueryAPIFail, actual.First().ErrorCode);
    }

    [Fact]
    public async Task VoidTickets_SuccessfulUpdateNetPosition_ExecuteQuery()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var query = new VoidTicketsQuery
        { CricketTransIds = new List<BetId> { new() { TransId = "123" } }, Tickets = tickets };
        voidTicketsService.ExecuteQuery(Arg.Any<VoidTicketsQuery>())
            .ReturnsForAnyArgs(new VoidTicketsModel
            {
                Validation = new VoidTicketsValidation(),
                Tickets = new List<TicketEmailModel>()
            });
        netPositionService.UpdateNetPosition(query.CricketTransIds, "").ReturnsForAnyArgs(true);

        // Act
        await service.VoidBet(query);

        // Assert
        await voidTicketsService.Received().ExecuteQuery(query);
    }

    [Fact]
    public async Task VoidTickets_FailToExecuteQuery_ReturnErrorResult()
    {
        // Arrange
        var validation = new VoidTicketsValidation
        {
            ErrorCode = 1,
            ErrorMsg = "Something Wrong"
        };
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var model = new VoidTicketsModel { Validation = validation, Tickets = [] };
        var expected = new List<Result>
            { new() { ErrorCode = model.Validation.ErrorCode, ErrorMsg = model.Validation.ErrorMsg } };
        var query = new VoidTicketsQuery { CricketTransIds = new List<BetId> { new() { TransId = "123" } }, Tickets = tickets };
        netPositionService.UpdateNetPosition(query.CricketTransIds, NetPositionConstant.ActionVoid).ReturnsForAnyArgs(true);
        voidTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(model);

        // Act
        var actual = await service.VoidBet(query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task VoidTickets_FailToExecuteQuery_RollBackNetPosition()
    {
        // Arrange
        var validation = new VoidTicketsValidation
        {
            ErrorCode = 1,
            ErrorMsg = "Something Wrong"
        };
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var model = new VoidTicketsModel
        {
            Validation = validation,
            Tickets = []
        };
        var query = new VoidTicketsQuery
        { CricketTransIds = new List<BetId> { new() { TransId = "123" } }, Tickets = tickets };
        netPositionService.UpdateNetPosition(query.CricketTransIds, "").ReturnsForAnyArgs(true);
        voidTicketsService.ExecuteQuery(Arg.Any<VoidTicketsQuery>()).ReturnsForAnyArgs(model);

        // Act
        await service.VoidBet(query);

        // Assert
        await netPositionService.Received().RollBackNetPosition(Arg.Any<IEnumerable<BetId>>());
    }

    [Fact]
    public async Task VoidTickets_NoTicket_DidNotSendMessage()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var query = new VoidTicketsQuery
        { CricketTransIds = new List<BetId> { new() { TransId = "123" } }, Tickets = tickets };
        var emailTickets = new List<TicketEmailModel>();
        netPositionService.UpdateNetPosition(query.CricketTransIds, "").ReturnsForAnyArgs(true);
        voidTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(new VoidTicketsModel
        {
            Validation = new VoidTicketsValidation(),
            Tickets = emailTickets
        });

        // Act
        await service.VoidBet(query);

        // Assert
        await voidTicketsService.DidNotReceive().SendMessage(query, emailTickets);
    }

    [Fact]
    public async Task VoidTickets_SendMessageThrowException_ReturnExceptionMessageResult()
    {
        // Arrange
        const string message = "Fail to Send Message";
        var exception = new Exception(message);
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var expected = new List<Result>
            { new() { ErrorCode = ErrorCode.SendMessageOrEmailFail, ErrorMsg = message } };
        var query = new VoidTicketsQuery
        { CricketTransIds = new List<BetId> { new() { TransId = "123" } }, Tickets = tickets };
        var emailTickets = new List<TicketEmailModel> { new() };
        netPositionService.UpdateNetPosition(query.CricketTransIds, "").ReturnsForAnyArgs(true);
        voidTicketsService.ExecuteQuery(query)
            .ReturnsForAnyArgs(new VoidTicketsModel
            {
                Validation = new VoidTicketsValidation(),
                Tickets = emailTickets
            });
        voidTicketsService
            .When(x => x.SendMessage(query, Arg.Any<List<TicketEmailModel>>()))
            .Do(_ => throw exception);

        // Act
        var actual = await service.VoidBet(query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task VoidTickets_SendEmailThrowException_WriteLog()
    {
        // Arrange
        const string message = "Fail to Send Message";
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var exception = new Exception(message);
        var query = new VoidTicketsQuery { MatchId = 123, CricketTransIds = tickets, Tickets = tickets };
        var emailTickets = new List<TicketEmailModel> { new() };
        netPositionService.UpdateNetPosition(query.CricketTransIds, "").ReturnsForAnyArgs(true);
        voidTicketsService.ExecuteQuery(query)
            .ReturnsForAnyArgs(new VoidTicketsModel
            {
                Validation = new VoidTicketsValidation(),
                Tickets = emailTickets
            });
        voidTicketsService
            .When(x => x.SendMessage(query, Arg.Any<List<TicketEmailModel>>()))
            .Do(_ => throw exception);

        // Act
        await service.VoidBet(query);

        // Assert
        await loggingService.Received().ErrorAsync("123", exception);
    }
}