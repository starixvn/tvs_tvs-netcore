using System.ComponentModel;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using SpecialDelete.VirtualSports.Common.Models;
using SpecialDelete.VirtualSports.Common.Services;
using SpecialDelete.VirtualSports.Common.ViewModels;
using SpecialDelete.VirtualSports.VoidParlaySub.Services.GetTickets;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.VirtualSports.VoidParlaySub.Services.GetTickets;


public class VoidBetListServiceTest : IClassFixture<RemotingRefFixture>
{
    [Fact]
    public void Create_Successfully_UpdateChoice()
    {
        // Arrange
        const string expected = "Choice Sub<div id='divEvent_123'></div>";
        var item = new GetTicketModel
        {
            TransId = 1111111,
            SubTransId = 123
        };
        var service = CreateService(item);

        // Act
        var ticketViewModel = service.Create(item);

        // Assert
        Assert.Equal(expected, ticketViewModel.Choice);
    }

    private VoidBetListServiceImp CreateService(GetTicketModel item)
    {
        const string choiceMain = "<div id=\"divEvent_0\">Main</div>";
        const string choiceSub = "Choice Sub";
        var ticket = new Ticket { TransId = 1111111, BetTypeId = 9999 };
        var ticketSub = new Ticket { TransId = 222222, BetTypeId = 8888 };
        var ticketHelper = new TicketHelper();
        var betListService = Substitute.For<BetListService>();
        var betListVirtualSportsService = Substitute.For<BetListVirtualSportsService>();
        betListVirtualSportsService.SetValue(item).ReturnsForAnyArgs(ticket);
        betListVirtualSportsService
            .SetSubValue(Arg.Any<Ticket>(), Arg.Any<GetTicketModel>())
            .ReturnsForAnyArgs(ticketSub);
        betListVirtualSportsService.CreateTicketHelper().ReturnsForAnyArgs(ticketHelper);
        betListVirtualSportsService.Create(ticket, ticketHelper).ReturnsForAnyArgs(new TicketViewModel());
        betListService.BuildChoice(ticket, ticketHelper, null, false).ReturnsForAnyArgs(choiceMain);
        betListService.BuildChoice(ticketSub, ticketHelper, null, false).ReturnsForAnyArgs(choiceSub);
        return new VoidBetListServiceImp(betListService, betListVirtualSportsService);
    }
}