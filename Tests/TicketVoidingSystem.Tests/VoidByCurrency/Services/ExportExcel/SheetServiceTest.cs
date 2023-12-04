using System;
using System.Collections.Generic;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services.ExportExcel;
using SpecialDelete.VoidByCurrency.Services.GetTickets;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Services.ExportExcel;

public class SheetServiceTest
{
    [Fact]
    public void AddTitle_ValidCriteria_ReturnTitleWithMatchId()
    {
        // Arrange
        const int matchId = 123;
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        const string expected = "Void By Currency - MatchId: 123";
        var service = CreateService();

        // Act
        service.AddTitle(worksheet, matchId);

        // Assert
        Assert.Equal(expected, worksheet.Cells["A1"].Value);
    }

    [Fact]
    public void AddMatch_CriteriaIncludeMatchInfo_ReturnValueInA5Cells()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var match = new Match
        {
            MatchCode = "12ADDE",
            EventDate = new DateTime(2017, 8, 18, 13, 20, 40)
        };
        var service = CreateService();

        // Act
        service.AddMatch(worksheet, match);

        // Assert
        Assert.Equal(match.MatchCode, worksheet.Cells["A5"].Value);
        Assert.Equal("08/18/2017", worksheet.Cells["D5"].Value);
    }

    [Fact]
    public void GetTickets_ValidDataFromGetTicketsService_CallTicketHtmlService()
    {
        // Arrange
        var query = new GetTicketsQuery
        {
            IsOutright = false
        };
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTickets(query).ReturnsForAnyArgs(new List<GetTicketModel> { new GetTicketModel { TransId = 132 } });
        var ticketHtmlService = Substitute.For<TicketService>();
        ticketHtmlService.GetTicketDetail(Arg.Any<GetTicketModel>(), Arg.Any<bool>())
            .ReturnsForAnyArgs(new TicketViewModel());
        var convertService = Substitute.For<ConvertService>();
        var service = new SheetServiceImp(getTicketsService, ticketHtmlService, convertService);

        // Act
        _ = service.GetTickets(query);

        // Assert
        ticketHtmlService.Received().GetTicketDetail(Arg.Is<GetTicketModel>(x => x.TransId == 132), false);
    }

    [Fact]
    public static void SetStyle_WrapText_ReturnTrue()
    {
        // Arrange
        var sheet = SetupTestingSheet.CreateTestingSheet();
        sheet.Cells["A8"].Value = 1;
        var service = CreateService();

        // Act
        service.SetStyle(sheet);

        // Assert
        Assert.True(sheet.Cells.Style.WrapText);
    }

    private static SheetServiceImp CreateService()
    {
        var getTicketsService = Substitute.For<GetTicketsService>();
        var ticketHtmlService = Substitute.For<TicketService>();
        var convertService = Substitute.For<ConvertService>();
        return new SheetServiceImp(
            getTicketsService,
            ticketHtmlService,
            convertService);
    }
}