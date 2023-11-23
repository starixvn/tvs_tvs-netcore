using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using SpecialDelete.NumberGame.Criteria;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Repositories;


public class RepositoryTest : IClassFixture<AppSettingFixture>
{
    [Fact]
    public async Task GetVoidTickets_HasInvalidTransIds_ReturnModelWithInvalidTransIds()
    {
        // Arrange
        var query = new GetVoidTicketsQuery
        {
            FromTransDate = new DateTime(2020, 11, 11),
            ToTransDate = new DateTime(2020, 11, 11)
        };
        var transId = new List<string> { "123" };
        var tickets = new List<GetTicketModel>
        {
            new() { TransId = 123 }
        };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<VoidTicketsCriteria>(null).ReturnsForAnyArgs(new VoidTicketsCriteria());
        mapper.Map<GetVoidTicketsCriteria>(null).ReturnsForAnyArgs(new GetVoidTicketsCriteria());
        dynamicRepository.FetchMultipleAsync<string, GetTicketModel>(Arg.Any<GetVoidTicketsCriteria>())
            .ReturnsForAnyArgs((transId, tickets));
        var repository = new RepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        var model = await repository.GetVoidTickets(query);

        // Assert
        const string expected = "123";
        Assert.Equal(expected, model.InvalidTransIds);
    }

    [Fact]
    public async Task VoidTickets_Always_ReturnTickets()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123", SiteDbGroupId = 0 },
            new() { TransId = "124", SiteDbGroupId = 1 },
            new() { TransId = "125", SiteDbGroupId = 0 }
        };
        var query = new VoidTicketsQuery
        {
            FromTransDate = new DateTime(2020, 11, 11),
            ToTransDate = new DateTime(2020, 11, 11),
            UserPwd = "1223",
            Tickets = tickets
        };
        var validations = new List<Result>();
        var emailTickets = new List<TicketEmailModel>
        {
            new() { TransId = 123 }
        };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<VoidTicketsCriteria>(null).ReturnsForAnyArgs(new VoidTicketsCriteria());
        dynamicRepository.FetchMultipleAsync<Result, TicketEmailModel>(Arg.Any<GetVoidTicketsCriteria>())
            .ReturnsForAnyArgs((validations, emailTickets));
        var repository = new RepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        var result = await repository.VoidTickets(query);

        // Assert
        Assert.NotNull(result.Tickets);
    }

    [Fact]
    public async Task VoidTickets_NotHaveAnyTickets_DoNotCallRepository()
    {
        // Arrange
        var query = new VoidTicketsQuery
        {
            FromTransDate = new DateTime(2020, 11, 11),
            ToTransDate = new DateTime(2020, 11, 11),
            UserPwd = "1223",
            Tickets = new List<BetId>()
        };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<VoidTicketsCriteria>(null).ReturnsForAnyArgs(new VoidTicketsCriteria());
        var repository = new RepositoryImp(mapper, dynamicRepository, sessionService);

        // Act
        await repository.VoidTickets(query);

        // Assert
        await dynamicRepository.Received(0)
            .FetchMultipleAsync<Result, TicketEmailModel>(Arg.Any<GetVoidTicketsCriteria>());
    }
}