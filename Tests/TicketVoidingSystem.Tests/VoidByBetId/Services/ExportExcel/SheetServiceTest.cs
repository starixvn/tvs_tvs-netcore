using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.ExportExcel;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using SpecialDelete.VoidByBetId.ViewModels;
using TicketVoidingSystem.Constants;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.ExportExcel;

[Category("VoidByBetId")]
public class SheetServiceTest
{
    [Fact]
    public async Task GetTickets_ValidDataFromGetTicketsService_CallTicketHtmlService()
    {
        // Arrange
        var tickets = new List<GetTicketModel> { new() { TransId = 132 } };
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTickets(new GetTicketsQuery()).ReturnsForAnyArgs((tickets, "", "", 1));
        var ticketService = Substitute.For<TicketService>();
        ticketService.GetTicket(Arg.Any<GetTicketModel>(), ChoiceType.Excel)
            .Returns(new TicketViewModel
            {
                Odds = string.Empty,
                Stake = string.Empty,
                Status = string.Empty,
                WinLoss = string.Empty
            });
        var service = new SheetServiceImp(getTicketsService, ticketService);

        // Act
        await service.GetTickets(new GetTicketsQuery());

        // Assert
        ticketService.Received().GetTicket(Arg.Is<GetTicketModel>(x => x.TransId == 132), ChoiceType.Excel);
    }

    [Fact]
    public void SetStyle_WrapText_ReturnTrue()
    {
        // Arrange
        var worksheet = SetupTestingSheet.CreateTestingSheet();
        worksheet.Cells["A5"].Value = 1;
        var service = CreateService();

        // Act
        service.SetStyle(worksheet);

        // Assert
        Assert.True(worksheet.Cells.Style.WrapText);
    }

    private static SheetServiceImp CreateService()
    {
        var getTicketsService = Substitute.For<GetTicketsService>();
        var ticketService = Substitute.For<TicketService>();
        return new SheetServiceImp(
            getTicketsService,
            ticketService);
    }
}