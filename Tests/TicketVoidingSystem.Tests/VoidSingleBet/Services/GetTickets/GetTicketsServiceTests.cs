using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.GetTickets;

public class GetTicketsServiceTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
{
    private readonly IMapper mapper;
    private readonly MapTicketService mapTicketService;
    private readonly IDynamicRepository repository;
    private readonly GetTicketsServiceImp service;

    public GetTicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        mapTicketService = Substitute.For<MapTicketService>();
        mapper = Substitute.For<IMapper>();
        service = new GetTicketsServiceImp(repository, mapper, mapTicketService);
    }

    [Fact]
    public async Task GetTickets_ValidCriteria_RepositoryHasCalled()
    {
        // Arrange
        var query = new GetTicketsQuery { MatchId = 132, OddsType = "123", FromTransDate = DateTime.Now, ToTransDate = DateTime.Now };
        var ticketsLists = new List<GetTicketModel> { new() { IsMixParlay = true }, new() { IsMixParlay = false } };
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).ReturnsForAnyArgs(new GetTicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).ReturnsForAnyArgs(ticketsLists);

        // Act
        _ = await service.GetTickets(query);

        // Assert
        await repository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }

    [Fact]
    public async Task GetTicketsForExportExcel_ValidCriteria_RepositoryHasCalled()
    {
        // Arrange
        var query = new GetTicketsQuery { MatchId = 132 };
        var ticketsLists = new List<GetTicketModel> { new() { IsMixParlay = true }, new() { IsMixParlay = false } };
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).ReturnsForAnyArgs(new GetTicketsCriteria());
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).ReturnsForAnyArgs(ticketsLists);
        mapTicketService.MapToTicketExcelModel(Arg.Any<GetTicketModel>(), Arg.Any<Match>())
            .ReturnsForAnyArgs(new ExcelTicketModel());

        // Act
        await service.GetTicketsForExportExcel(query);

        // Assert
        await repository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }
}