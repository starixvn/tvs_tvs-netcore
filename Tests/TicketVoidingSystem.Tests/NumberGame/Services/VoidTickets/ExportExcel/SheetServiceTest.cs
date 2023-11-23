using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Repositories;
using SpecialDelete.NumberGame.Services.GetTickets;
using SpecialDelete.NumberGame.Services.VoidTickets.ExportExcel;
using SpecialDelete.NumberGame.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Services.VoidTickets.ExportExcel;


public class SheetServiceTest
{
    [Fact]
    public async Task GetTickets_ValidDataFromTicketService_CallTicketHtmlService()
    {
        // Arrange
        var repository = Substitute.For<Repository>();
        var model = new GetTicketsModel
        {
            Tickets = new List<GetTicketModel> { new() { TransId = 132 } }
        };
        var ticketViewModel = new TicketViewModel
        { Choice = "<span>Choice</span><div class='match'></div><div class='league'></div>" };
        repository.GetVoidTickets(Arg.Any<GetVoidTicketsQuery>()).ReturnsForAnyArgs(model);
        var ticketService = Substitute.For<TicketService>();
        ticketService.GetTicket(new GetTicketModel(), false).ReturnsForAnyArgs(ticketViewModel);
        var mapper = Substitute.For<IMapper>();
        mapper.Map<ExcelTicketModel>(null).ReturnsForAnyArgs(new ExcelTicketModel());
        var service = new SheetServiceImp(mapper, repository, ticketService);

        // Act
        await service.GetTickets(new GetVoidTicketsQuery());

        // Assert
        ticketService.Received().GetTicket(Arg.Is<GetTicketModel>(x => x.TransId == 132), false);
    }

    [Fact]
    public static void SetStyle_WrapText_ReturnTrue()
    {
        // Arrange
        var sheet = SetupTestingSheet.CreateTestingSheet();
        sheet.Cells["A5"].Value = 1;
        var service = CreateService();

        // Act
        service.SetStyle(sheet);

        // Assert
        Assert.True(sheet.Cells.Style.WrapText);
    }

    private static SheetServiceImp CreateService()
    {
        var repository = Substitute.For<Repository>();
        var ticketService = Substitute.For<TicketService>();
        var mapper = Substitute.For<IMapper>();
        return new SheetServiceImp(mapper, repository, ticketService);
    }
}