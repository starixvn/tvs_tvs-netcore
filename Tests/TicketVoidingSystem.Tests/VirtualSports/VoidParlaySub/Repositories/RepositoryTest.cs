using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Criteria;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Repositories;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Repositories;

public class RepositoryTest : IClassFixture<AppSettingFixture>
{
    [Fact]
    public async Task ExecuteQuery_GetVoidTicketsCriteria_ReturnTicketsResult()
    {
        // Arrange
        var expected = new List<GetTicketModel>
        {
            new() { TransId = 1 }
        };
        var query = new GetTicketsQuery();
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        dynamicRepository.FetchMultipleAsync<string, GetTicketModel>(new GetTicketsCriteria()).ReturnsForAnyArgs((new List<string>(), expected));
        var repository = new RepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        var model = await repository.GetTickets(query);

        // Assert
        Assert.NotNull(model.Tickets);
    }

    [Fact]
    public async Task ExecuteQuery_VoidTicketsCriteria_ReturnTicketsResult()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1  },
            new() { TransId = "125", SiteDbGroupId = 0  }
        };
        var emailTickets = new List<TicketEmailModel>
        {
            new() { TransId = 1 }
        };
        var validations = new List<VoidTicketsValidation>();
        var expected = new ValueTuple<IEnumerable<VoidTicketsValidation>, IEnumerable<TicketEmailModel>>(validations, emailTickets);
        var query = new VoidTicketsQuery { Password = "1231", Tickets = tickets };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<VoidTicketsCriteria>(null).ReturnsForAnyArgs(new VoidTicketsCriteria());
        dynamicRepository.FetchMultipleAsync<VoidTicketsValidation, TicketEmailModel>(new VoidTicketsCriteria()).ReturnsForAnyArgs(expected);
        var repository = new RepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        var model = await repository.VoidTickets(query);

        // Assert
        Assert.NotNull(model.Tickets);
    }

    [Fact]
    public async Task VoidTickets_HaveNotAnyTickets_DoNotCallRepository()
    {
        // Arrange
        var query = new VoidTicketsQuery { Password = "1231", Tickets = new List<BetId>() };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<VoidTicketsCriteria>(null).ReturnsForAnyArgs(new VoidTicketsCriteria());
        var repository = new RepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        await repository.VoidTickets(query);

        // Assert
        await dynamicRepository.Received(0)
            .FetchMultipleAsync<VoidTicketsValidation, TicketEmailModel>(Arg.Any<VoidTicketsCriteria>());
    }
}