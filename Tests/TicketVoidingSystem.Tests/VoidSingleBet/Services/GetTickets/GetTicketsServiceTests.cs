using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.GetTickets;

public class GetTicketsServiceTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
{
    [Fact]
    public async Task GetTickets_ValidCriteria_RepositoryHasCalled()
    {
        // Arrange
        var expected = new List<GetTicketModel> { new() { TransId = 1346 } };
        var query = new GetTicketsQuery { MatchId = 132, OddsType = "123" };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var mapTicketService = Substitute.For<MapTicketService>();
        dynamicRepository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).ReturnsForAnyArgs(expected);
        var repository = new GetTicketsServiceImp(dynamicRepository, TestSetup.CreateMapper(), mapTicketService);

        // Act
        var actual = await repository.GetTickets(query);

        // Assert
        dynamicRepository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }

    [Fact]
    public async Task GetTicketsForExportExcel_ValidCriteria_RepositoryHasCalled()
    {
        // Arrange
        var expected = new List<GetTicketModel> { new() { TransId = 1346 } };
        var query = new GetTicketsQuery { MatchId = 132 };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        var mapTicketService = Substitute.For<MapTicketService>();
        mapTicketService.MapToTicketExcelModel(default, default).ReturnsForAnyArgs(new ExcelTicketModel());
        dynamicRepository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).ReturnsForAnyArgs(expected);
        var repository = new GetTicketsServiceImp(dynamicRepository, TestSetup.CreateMapper(), mapTicketService);

        // Act
        var actual = await repository.GetTicketsForExportExcel(query);

        // Assert
        await dynamicRepository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
    }
}