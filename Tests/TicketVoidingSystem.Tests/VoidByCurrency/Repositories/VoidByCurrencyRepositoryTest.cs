using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Criteria;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Repositories;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Repositories;


public class VoidByCurrencyRepositoryTest
{
    [Fact]
    public async Task GetTickets_HasCriteria_ReturnTicketsFromDynamicRepository()
    {
        // Arrange
        var expected = new List<GetTicketModel> { new() { TransId = 1357944 } };
        var query = new GetTicketsQuery { MatchId = 132465 };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<VoidTicketsCriteria>(null).ReturnsForAnyArgs(new VoidTicketsCriteria());
        dynamicRepository.FetchAsync<GetTicketModel>(new GetTicketsCriteria()).ReturnsForAnyArgs(expected);
        var repository = new VoidByCurrencyRepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        var actual = await repository.GetTickets(query);

        // Assert
        Assert.NotEmpty(actual);
    }

    [Fact]
    public async Task VoidTickets_HasCriteria_ReturnTicketsFromDynamicRepository()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var validations = new List<VoidTicketsValidation>
        {
            new() { ErrorCode = 1, SiteDbGroupId = 0 },
            new() { ErrorCode = 0, SiteDbGroupId = 1 }
        };
        var expected = new List<TicketEmailModel> { new() { TransId = 1357944 } };
        var query = new VoidTicketsQuery { MatchId = 132465, UserPassword = "12312", Tickets = tickets };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        dynamicRepository.FetchMultipleAsync<VoidTicketsValidation, TicketEmailModel>(new VoidTicketsCriteria())
            .ReturnsForAnyArgs((validations, expected));
        var mapper = Substitute.For<IMapper>();
        mapper.Map<VoidTicketsCriteria>(null).ReturnsForAnyArgs(new VoidTicketsCriteria());
        var repository = new VoidByCurrencyRepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        var actual = await repository.VoidTickets(query);

        // Assert
        Assert.NotEmpty(actual.Tickets);
    }

    [Fact]
    public async Task VoidTickets_HaveNotAnyTicket_DoNotCallRepository()
    {
        // Arrange
        var query = new VoidTicketsQuery { UserPassword = "12312", Tickets = new List<BetId>() };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<VoidTicketsCriteria>(null).ReturnsForAnyArgs(new VoidTicketsCriteria());
        var repository = new VoidByCurrencyRepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        await repository.VoidTickets(query);

        // Assert
        await dynamicRepository.Received(0)
            .FetchMultipleAsync<VoidTicketsValidation, TicketEmailModel>(Arg.Any<VoidTicketsCriteria>());
    }
}