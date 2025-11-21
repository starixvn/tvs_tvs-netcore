using System;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.VoidParlaySub.Models;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using Xunit;
using SheetServiceImp = SpecialDelete.VirtualSports.VoidParlaySub.Services.ExportExcel.SheetServiceImp;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Services.ExportExcel;

public class SheetServiceTest
{
    [Fact]
    public async Task GetTickets_ValidData_CallTicketService()
    {
        // Arrange
        const string choice = "<a>Choice</a><div class='offer-name-list'></div><div class='bettype'>BetType</div><span class='bet-team-choice'>Handicap</span><div class='match'>Match</div><div class='league'>League</div>";
        var query = new ExportExcelQuery { MatchId = 123 };
        var fakeModel = new GetTicketsModel { Tickets = [new GetTicketModel { TransId = 9999 }] };
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.ExecuteQuery(query).ReturnsForAnyArgs(fakeModel);
        var ticketService = Substitute.For<TicketService>();
        ticketService.GetTicket(new GetTicketModel())
            .ReturnsForAnyArgs(new TicketViewModel 
            { 
                Stake = string.Empty, 
                Choice = choice,
                TransDate = string.Empty,
                Odds = string.Empty,
                Status = string.Empty,
                WinLoss = string.Empty
            });
        var service = new SheetServiceImp(getTicketsService, ticketService);

        // Act
        await service.GetTickets(query);

        // Assert
        ticketService.Received().GetTicket(Arg.Is<GetTicketModel>(x => x.TransId == 9999));
    }

    [Fact]
    public void SetStyle_WrapText_ReturnTrue()
    {
        // Arrange
        var sheet = SetupTestingSheet.CreateTestingSheet();
        sheet.Cells["A8"].Value = 1;
        var getTicketsService = Substitute.For<GetTicketsService>();
        var ticketService = Substitute.For<TicketService>();
        var service = new SheetServiceImp(getTicketsService, ticketService);

        // Act
        service.SetStyle(sheet);

        // Assert
        Assert.True(sheet.Cells.Style.WrapText);
    }

    [Fact]
    public void EditMatch_ValidMatchId_SetValueInCellsMatch()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var query = new ExportExcelQuery
        {
            MatchId = 12,
            MatchCode = "N/A",
            EventDate = new DateTime(2017, 11, 14, 13, 20, 40),
            MatchEvent = "Russia-vs-New"
        };
        var getTicketsService = Substitute.For<GetTicketsService>();
        var ticketService = Substitute.For<TicketService>();
        var service = new SheetServiceImp(getTicketsService, ticketService);

        // Act
        service.EditMatch(worksheet, query);

        // Assert
        Assert.Equal(query.MatchCode, worksheet.Cells["A5"].Value);
        Assert.Equal("11/14/2017", worksheet.Cells["D5"].Value);
    }

    [Fact]
    public void EditMatch_InValidMatchId_NeedSetValue()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        var query = new ExportExcelQuery();
        var getTicketsService = Substitute.For<GetTicketsService>();
        var ticketService = Substitute.For<TicketService>();
        var service = new SheetServiceImp(getTicketsService, ticketService);

        // Act
        service.EditMatch(worksheet, query);

        // Assert
        Assert.Null(worksheet.Cells["A5"].Value);
        Assert.Null(worksheet.Cells["B5"].Value);
    }
}