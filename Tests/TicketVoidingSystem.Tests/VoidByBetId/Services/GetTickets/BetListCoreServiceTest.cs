using System.ComponentModel;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.GetTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.GetTickets;

[Category("VoidByBetId")]
public class BetListCoreServiceTest : IClassFixture<RemotingRefFixture>
{
    [Fact]
    public void BuildChoice_TicketHelperSetting_ShowParlayDetailIsFalse()
    {
        // Arrange
        var item = new GetTicketModel { BetType = BetTypeConstant.BitCoinOverUnder };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());
        var service = new BetListCoreServiceImp(mapper, betListService);

        // Act
        service.Create(item, ChoiceType.Html);

        // Assert
        betListService.Received()
            .BuildChoice(Arg.Any<Ticket>(), Arg.Is<TicketHelper>(x => !x.ShowSystemParlayDetail), null, false);
    }

    [Fact]
    public void BuildChoice_TicketHelperSetting_MatchIsTrue()
    {
        // Arrange
        var item = new GetTicketModel();
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());
        var service = new BetListCoreServiceImp(mapper, betListService);

        // Act
        service.Create(item, ChoiceType.Html);

        // Assert
        betListService.Received()
            .BuildChoice(Arg.Any<Ticket>(), Arg.Is<TicketHelper>(x => x.ShowMatch), null, false);
    }

    [Fact]
    public void BuildChoice_ValueOfTransId_IsZero()
    {
        // Arrange
        var item = new GetTicketModel { TransId = 1234 };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());
        var service = new BetListCoreServiceImp(mapper, betListService);

        // Act
        service.Create(item, ChoiceType.Html);

        // Assert
        betListService.Received()
            .BuildChoice(Arg.Is<Ticket>(x => x.TransId == 0), Arg.Any<TicketHelper>(), null, false);
    }

    [Fact]
    public void BuildChoice_ChoiceTypeIsExcel_BuildChoiceExcel()
    {
        // Arrange
        const string expected = "Line1\nLine2";
        var item = new GetTicketModel();
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());
        var service = new BetListCoreServiceImp(mapper, betListService);
        betListService.BuildChoiceExcel(new Ticket(), new TicketHelper(), null, false)
            .ReturnsForAnyArgs(expected);

        // Act
        var ticket = service.Create(item, ChoiceType.Excel);

        // Assert
        Assert.Equal(expected, ticket.Choice);
    }
}