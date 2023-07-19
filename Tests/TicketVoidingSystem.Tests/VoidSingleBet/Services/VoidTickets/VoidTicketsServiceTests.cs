using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.VoidTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.VoidTickets;

public class VoidTicketsServiceTests
{
    [Fact]
    public async Task VoidBet_ValidQuery_RepositoryHasCalled()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            MatchId = 123,
            UserPassword = string.Empty,
            Message = new Message(),
            Tickets = new List<BetId> { new() }
        };
        var validations = new List<VoidTicketValidation> { new() { SiteDbGroupId = 0, NegativeBalanceUsers = "" } };
        var tickets = new List<TicketEmailModel> { new() { TransId = 1 } };
        var fakeData =
            new ValueTuple<IEnumerable<VoidTicketValidation>, IEnumerable<TicketEmailModel>>(validations, tickets);

        var repository = Substitute.For<IDynamicRepository>();
        repository
            .FetchMultipleAsync<VoidTicketValidation, TicketEmailModel>(Arg.Compat.Any<VoidTicketsCriteria>())
            .ReturnsForAnyArgs(fakeData);
        var loggingService = Substitute.For<LoggingService>();
        var sessionService = Substitute.For<SessionService>();
        var service = new VoidTicketsServiceImp(sessionService, TestSetup.CreateMapper(), repository, loggingService);

        // Act
        var result = await service.VoidBet(query);

        // Assert
        Assert.NotNull(result);
        await repository.Received()
            .FetchMultipleAsync<VoidTicketValidation, TicketEmailModel>(Arg.Compat.Any<VoidTicketsCriteria>());
    }

    [Fact]
    public async Task VoidBet_HasException_ReturnExpected()
    {
        // Arrange
        var expectedException = new Exception("Void bet was error!");
        var query = new VoidTicketsQuery
        {
            MatchId = 123,
            UserPassword = string.Empty,
            Message = new Message(),
            Tickets = new List<BetId> { new() }
        };
        var repository = Substitute.For<IDynamicRepository>();
        repository.When(x =>
                x.FetchMultipleAsync<VoidTicketValidation, TicketEmailModel>(Arg.Compat.Any<VoidTicketsCriteria>()))
            .Do(_ => throw expectedException);
        var loggingService = Substitute.For<LoggingService>();
        var sessionService = Substitute.For<SessionService>();
        var service = new VoidTicketsServiceImp(sessionService, TestSetup.CreateMapper(), repository, loggingService);

        // Act
        var result = await service.VoidBet(query);

        // Assert
        Assert.NotNull(result);
        await repository.Received()
            .FetchMultipleAsync<VoidTicketValidation, TicketEmailModel>(Arg.Compat.Any<VoidTicketsCriteria>());
    }
}