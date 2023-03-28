using Fanex.BetList.Core.Entities;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.Services.ExportExcel;
using TicketVoidingSystem.TicketListing.ViewModels;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Services;

public class MapTicketServiceTests : IClassFixture<RemotingRefFixture>
{
    [Theory]
    [InlineData(38)]
    [InlineData(376)]
    public void MapToListTicketsViewModel_ReturnViewModel(int betTypeId)
    {
        // Arrange
        var detailTicketModels = new List<DetailTicketModel>
        {
            new() { TransDate  = new DateTime(2023, 02, 10), SecAcceptFlag = true, IsParlay = true, BetType = betTypeId, Status = TicketStatus.Running, WinLost = "1"},
            new() { TransDate  = new DateTime(2023, 02, 10), SecAcceptFlag = true, IsParlay = true, BetType = betTypeId, Status = TicketStatus.Won, WinLost = "-1" },
            new() { TransDate  = new DateTime(2023, 02, 10), SecAcceptFlag = false, IsParlay = false, BetType = betTypeId, Status = TicketStatus.Won },
        };
        var betListService = Substitute.For<BetListService>();
        var convertBetListForExcelService = Substitute.For<ConvertBetListForExcelService>();
        var service = new MapTicketServiceImp(betListService, TestSetup.CreateMapper(), convertBetListForExcelService);

        // Act
        var actual = service.MapToListTicketsViewModel(detailTicketModels);

        // Assert
        betListService.Received().GetOdds(Arg.Any<ITicket>(), Arg.Any<bool>());
        Assert.NotNull(actual);
    }

    [Fact]
    public void MapToListExcelTicketsModel_ReturnViewModel()
    {
        // Arrange
        var ticketViewModels = new List<TicketViewModel>
        {
            new() { SecondAcceptFlag = "1" },
            new() { SecondAcceptFlag = "" },
        };
        var betListService = Substitute.For<BetListService>();
        var convertBetListForExcelService = Substitute.For<ConvertBetListForExcelService>();
        var service = new MapTicketServiceImp(betListService, TestSetup.CreateMapper(), convertBetListForExcelService);

        // Act
        var actual = service.MapToListExcelTicketsModel(ticketViewModels);

        // Assert
        convertBetListForExcelService.Received().ChoiceHtmlToText(Arg.Any<string>(), Arg.Any<string>());
        convertBetListForExcelService.Received().WinLossHtmlToText(Arg.Any<string>());
        Assert.NotNull(actual);
    }
}