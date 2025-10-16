using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Services;

public class GetTicketsServiceTests
{
    [Fact]
    public async Task GetTickets_RepositoryHasCalled()
    {
        // Arrange
        var query = new GetTicketsDetailQuery();
        var repository = Substitute.For<IDynamicRepository>();
        var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        repository.FetchAsync<DetailTicketModel>(default).ReturnsForAnyArgs(new List<DetailTicketModel>());
        var service = new GetTicketsServiceImp(TestSetup.CreateMapper(), repository, affectTicketsFromSettlementHistoryService, mapTicketService);

        // Act
        var actual = await service.GetTickets(query);

        // Assert
        await affectTicketsFromSettlementHistoryService.Received(1).GetTickets(Arg.Any<bool>(), Arg.Any<int>());
        await repository.Received(1).FetchAsync<DetailTicketModel>(Arg.Any<GetTicketsDetailCriteria>());
        Assert.NotNull(actual);
    }

    [Fact]
    public async Task GetTicketsForExportExcel_RepositoryHasCalled()
    {
        // Arrange
        var query = new ExportExcelQuery();
        var repository = Substitute.For<IDynamicRepository>();
        var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        repository.FetchAsync<DetailTicketModel>(default).ReturnsForAnyArgs(new List<DetailTicketModel>());
        var service = new GetTicketsServiceImp(TestSetup.CreateMapper(), repository, affectTicketsFromSettlementHistoryService, mapTicketService);

        // Act
        await service.GetTicketsForExportExcel(query);

        // Assert
        await affectTicketsFromSettlementHistoryService.Received(1).GetTickets(Arg.Any<bool>(), Arg.Any<int>());
        await repository.Received(1).FetchAsync<DetailTicketModel>(Arg.Any<GetTicketsDetailCriteria>());
        mapTicketService.Received(1).MapToListTicketsViewModel(Arg.Any<IEnumerable<DetailTicketModel>>());
        mapTicketService.Received(1).MapToListExcelTicketsModel(Arg.Any<IEnumerable<TicketViewModel>>());
    }

    [Fact]
    public async Task GetTicketsForSendDataOic_RepositoryHasCalled()
    {
        // Arrange
        var query = new SendFileQuery();
        var repository = Substitute.For<IDynamicRepository>();
        var mapper = Substitute.For<IMapper>();
        var affectTicketsFromSettlementHistoryService = Substitute.For<AffectTicketsFromSettlementHistoryService>();
        var mapTicketService = Substitute.For<MapTicketService>();
        mapper.Map<GetTicketExcelOicCriteria>(Arg.Any<GetTicketsDetailCriteria>()).Returns(new GetTicketExcelOicCriteria());
        repository.GetAsync<ExcelOicModel>(Arg.Any<GetTicketExcelOicCriteria>()).Returns(new ExcelOicModel());
        var service = new GetTicketsServiceImp(TestSetup.CreateMapper(), repository, affectTicketsFromSettlementHistoryService, mapTicketService);

        // Act
        await service.GetTicketsForSendDataOic(query, "");

        // Assert
        await repository.Received(1).GetAsync<ExcelOicModel>(Arg.Any<GetTicketExcelOicCriteria>());
    }
}