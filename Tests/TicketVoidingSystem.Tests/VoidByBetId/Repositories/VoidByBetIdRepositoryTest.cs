using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using SpecialDelete.VoidByBetId.Criteria;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Repositories;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeHybridParlay;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Repositories;

[Category("VoidByBetId")]
public class VoidByBetIdRepositoryTest : IClassFixture<AppSettingFixture>
{
    [Fact]
    public async Task GetTickets_HasCriteria_ReturnTicketsFromDynamicRepository()
    {
        // Arrange
        var validations = new List<GetTicketValidation>
        {
            new()
        };
        var expected = new List<GetTicketModel> { new() { TransId = 1112 } };
        var criteria = new GetTicketsQuery { TransIds = "132465" };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var hybridParlayTicketService = Substitute.For<HybridParlayTicketService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<GetTicketsCriteria>(null).ReturnsForAnyArgs(new GetTicketsCriteria());
        dynamicRepository.FetchMultipleAsync<GetTicketValidation, GetTicketModel>(Arg.Any<GetTicketsCriteria>())
            .ReturnsForAnyArgs((validations, expected));
        var repository = new VoidByBetIdRepositoryImp(mapper, dynamicRepository, sessionService, hybridParlayTicketService);

        // Act
        var (tickets, _, _, _) = await repository.GetTickets(criteria);

        // Assert
        Assert.NotNull(tickets);
    }

    [Fact]
    public async Task VoidTickets_HasCriteria_ReturnTicketsFromDynamicRepository()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "123" },
            new() { TransId = "124" },
            new() { TransId = "125" }
        };
        var fakeData = new ValueTuple<IEnumerable<VoidTicketValidation>, IEnumerable<TicketEmailModel>>(
            new List<VoidTicketValidation> { new() },
            new List<TicketEmailModel> { new() { RefNo = "123456" } });
        var query = new VoidTicketsQuery { Tickets = tickets, Password = "123" };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var sessionService = Substitute.For<SessionService>();
        var hybridParlayTicketService = Substitute.For<HybridParlayTicketService>();
        var mapper = Substitute.For<IMapper>();
        dynamicRepository.FetchMultipleAsync<VoidTicketValidation, TicketEmailModel>(Arg.Any<VoidTicketsCriteria>())
            .ReturnsForAnyArgs(fakeData);
        sessionService.GetClientIp().ReturnsForAnyArgs("123");
        var repository = new VoidByBetIdRepositoryImp(mapper, dynamicRepository, sessionService, hybridParlayTicketService);

        // Act
        var actual = await repository.VoidTickets(query);

        // Assert
        Assert.NotNull(actual.Tickets);
    }
}