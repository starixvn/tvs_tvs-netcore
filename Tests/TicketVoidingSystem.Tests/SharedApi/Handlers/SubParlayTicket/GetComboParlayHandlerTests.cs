using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SubParlayTicket;

public class GetComboParlayHandlerTests
{
    private readonly GetComboParlayHandler handler;
    private readonly TicketsService ticketsService;

    public GetComboParlayHandlerTests()
    {
        ticketsService = Substitute.For<TicketsService>();
        handler = new GetComboParlayHandler(ticketsService);
    }

    [Fact]
    public async Task Handle_HasComboNameIsNull_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetComboParlayRequest();
        var expected = new List<TicketViewModel> { new() { Choice = "", SubTransId = "" } };
        ticketsService.GetComboName(Arg.Any<QueryComboParlay>()).ReturnsForAnyArgs((string[])null);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task Handle_ComboNameIsArrayEmpty_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetComboParlayRequest();
        var expected = new List<TicketViewModel> { new() { Choice = "", SubTransId = "" } };
        var comboName = Array.Empty<string>();
        ticketsService.GetComboName(Arg.Any<QueryComboParlay>()).ReturnsForAnyArgs(comboName);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task Handle_HasComboName_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetComboParlayRequest { RefNo = "1" };
        var expected = new List<TicketViewModel> { new() { Choice = "<div><span class='combo-name'>1 x </span><span class='combo-stake'>1</span></div><div><span class='combo-name'> x </span><span class='combo-stake'>2</span></div>", SubTransId = "" } };
        var comboName = new[] { "1", "" };
        var tickets = new List<TicketModel> { new() { Stake = 1 }, new() { Stake = 2 } };
        ticketsService.GetComboName(Arg.Any<QueryComboParlay>()).ReturnsForAnyArgs(comboName);
        ticketsService.GetTickets("1", CancellationToken.None).ReturnsForAnyArgs(tickets);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}