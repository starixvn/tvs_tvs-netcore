using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Services.MarkUnmarkTickets;

public class GetTicketsServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly IMapper mapper;
    private readonly MapTicketService mapTicketService;
    private readonly IDynamicRepository repository;
    private readonly UserPermissionService userPermissionService;

    private readonly GetTicketsServiceImp service;

    public GetTicketsServiceTests()
    {
        userPermissionService = Substitute.For<UserPermissionService>();
        mapper = Substitute.For<IMapper>();
        mapTicketService = Substitute.For<MapTicketService>();
        repository = Substitute.For<IDynamicRepository>();
        service = new GetTicketsServiceImp(mapper, mapTicketService, repository, userPermissionService);
    }

    [Fact]
    public async Task GetTickets_HasCriteria_CallGetTicketsByRepository()
    {
        // Arrange
        var query = new GetTicketsQuery { MatchId = 132 };
        var validation = new List<GetTicketValidationModel> { new() { ErrorCode = 0 } };
        var ticketList = new List<GetTicketModel> { new() { BetId = 123 } };
        var criteria = new GetTicketsCriteria();
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).ReturnsForAnyArgs(criteria);
        repository.FetchMultipleAsync<GetTicketValidationModel, GetTicketModel>(default).ReturnsForAnyArgs((validation, ticketList));

        // Act
        var actual = await service.GetTickets(query);

        // Assert
        Assert.NotNull(actual.Tickets);
    }

    [Fact]
    public async Task GetTicketsForExportExcel_HasCriteria_CallGetTicketsByRepository()
    {
        // Arrange
        var query = new GetTicketsQuery { MatchId = 132 };
        var validation = new List<GetTicketValidationModel> { new() { ErrorCode = 0 } };
        var ticketList = new List<GetTicketModel> { new() { BetId = 123 } };
        var userPermission = new UserPermission();
        var criteria = new GetTicketsCriteria();
        var ticketModels = new List<GetTicketModel> { new() { BetId = 123 } };
        mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).ReturnsForAnyArgs(criteria);
        userPermissionService.GetUserPermission().ReturnsForAnyArgs(userPermission);
        repository.FetchMultipleAsync<GetTicketValidationModel, GetTicketModel>(default).ReturnsForAnyArgs((validation, ticketList));
        var tickets = new List<ExcelTicketModel> { };
        mapTicketService.MapToExcelTicketModel(Arg.Any<IEnumerable<GetTicketModel>>(), Arg.Any<UserPermission>()).ReturnsForAnyArgs(tickets);

        // Act
        var actual = await service.GetTicketsForExportExcel(query);

        // Assert
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task GetDetailTickets_HasCriteria_CallGetTicketsByRepository()
    {
        // Arrange
        var query = new GetDetailTicketsQuery { MatchId = 132 };
        var expected = new List<GetTicketModel> { new() { BetId = 123 } };
        var criteria = new GetDetailTicketsCriteria();
        mapper.Map<GetDetailTicketsCriteria>(Arg.Any<GetDetailTicketsQuery>()).ReturnsForAnyArgs(criteria);
        repository.FetchAsync<GetTicketModel>(default).ReturnsForAnyArgs(expected);

        // Act
        var tickets = await service.GetDetailTickets(query);

        // Assert
        Assert.NotNull(tickets);
    }

    [Fact]
    public async Task GetDetailTicketsForExportExcel_HasCriteria_CallGetTicketsByRepository()
    {
        // Arrange
        var query = new GetDetailTicketsQuery { MatchId = 132 };
        var validation = new List<GetTicketValidationModel> { new() { ErrorCode = 0 } };
        var ticketList = new List<GetTicketModel> { new() { BetId = 123 } };
        var userPermission = new UserPermission();
        var criteria = new GetDetailTicketsCriteria();
        var ticketModels = new List<GetTicketModel> { new() { BetId = 123 } };
        repository.FetchAsync<GetTicketModel>(Arg.Any<GetDetailTicketsCriteria>()).ReturnsForAnyArgs(ticketModels);
        mapper.Map<GetDetailTicketsCriteria>(Arg.Any<GetDetailTicketsQuery>()).ReturnsForAnyArgs(criteria);
        userPermissionService.GetUserPermission().ReturnsForAnyArgs(userPermission);
        repository.FetchMultipleAsync<GetTicketValidationModel, GetTicketModel>(default).ReturnsForAnyArgs((validation, ticketList));
        var mapTicketService = Substitute.For<MapTicketService>();
        var tickets = new List<ExcelTicketModel> { };
        mapTicketService.MapToExcelTicketModel(Arg.Any<IEnumerable<GetTicketModel>>(), Arg.Any<UserPermission>()).ReturnsForAnyArgs(tickets);

        // Act
        var actual = await service.GetDetailTicketsForExportExcel(query);

        // Assert
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task GetAllMarkedTickets_HasCriteria_CallGetTicketsByRepository()
    {
        // Arrange
        var expected = new List<AllMarkedTicketModel> { new() { MatchId = 123 } };
        var criteria = new AllMarkedTicketsCriteria();
        repository.FetchAsync<AllMarkedTicketModel>(default).ReturnsForAnyArgs(expected);
        mapper.Map<AllMarkedTicketsCriteria>(Arg.Any<AllMarkedTicketsQuery>()).ReturnsForAnyArgs(criteria);
        // Act
        var tickets = await service.GetAllMarkedTickets(new AllMarkedTicketsQuery());

        // Assert
        Assert.NotNull(tickets);
    }
}