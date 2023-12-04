using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.RecoverBet.Criteria;
using SpecialDelete.VirtualSports.RecoverBet.Models;
using SpecialDelete.VirtualSports.RecoverBet.Repositories;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.RecoverBet.Repositories;


public class RepositoryTest
{
    [Fact]
    public async Task ExecuteQuery_GetRecoverTicketsCriteria_ReturnTicketsResult()
    {
        // Arrange
        var validations = new List<GetTicketsValidation>
        {
            new()
        };
        var tickets = new List<GetTicketModel> { new() };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<GetTicketsCriteria>(null).ReturnsForAnyArgs(new GetTicketsCriteria());
        dynamicRepository.FetchMultipleAsync<GetTicketsValidation, GetTicketModel>(new GetTicketsCriteria())
            .ReturnsForAnyArgs((validations, tickets));
        var repository = new RepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        var model = await repository.GetTickets(new Query());

        // Assert
        Assert.NotNull(model.Tickets);
    }

    [Fact]
    public async Task ExecuteQuery_RecoverTicketsCriteria_ReturnTicketsResult()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1  },
            new() { TransId = "125", SiteDbGroupId = 0  }
        };
        var query = new Query
        {
            Tickets = tickets
        };
        var validations = new List<RecoverTicketsValidation>
        {
            new()
        };
        var recoverTickets = new List<RecoverTicketModel> { new() };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<GetTicketsCriteria>(null).ReturnsForAnyArgs(new GetTicketsCriteria());
        dynamicRepository
            .FetchMultipleAsync<RecoverTicketsValidation, RecoverTicketModel>(new RecoverTicketsCriteria())
            .ReturnsForAnyArgs((validations, recoverTickets));
        var repository = new RepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        var model = await repository.RecoverTickets(query);

        // Assert
        Assert.NotNull(model.Tickets);
    }

    [Fact]
    public async Task ExecuteQuery_HaveNotAnyTickets_DoNotCallRepository()
    {
        // Arrange
        var query = new Query
        {
            Tickets = new List<BetId>()
        };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<GetTicketsCriteria>(null).ReturnsForAnyArgs(new GetTicketsCriteria());
        var repository = new RepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        await repository.RecoverTickets(query);

        // Assert
        await dynamicRepository.Received(0)
            .FetchMultipleAsync<RecoverTicketsValidation, RecoverTicketModel>(
                Arg.Any<RecoverTicketsCriteria>());
    }
}