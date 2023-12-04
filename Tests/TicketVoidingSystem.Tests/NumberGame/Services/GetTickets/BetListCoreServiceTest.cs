using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using SpecialDelete.NumberGame.Models;
using SpecialDelete.NumberGame.Services.GetTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.NumberGame.Services.GetTickets;


public class BetListCoreServiceTest : IClassFixture<RemotingRefFixture>
{
    [Fact]
    public void GetChoice_BetType90_InsertSpaceBetweenNumber()
    {
        // Arrange
        var item = new GetTicketModel { BetType = 90 };
        const string choiceFromBetList = "<span class='favorite'>1,6,11,16,21 [15]</span>";
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        betListService.BuildChoice(new Ticket(), new TicketHelper(), null, false)
            .ReturnsForAnyArgs(choiceFromBetList);
        var service = new BetListCoreServiceImp(mapper, betListService);

        // Act
        var viewModel = service.GetTicket(item, true);

        // Assert
        const string expected = "<span class='favorite'>1, 6, 11, 16, 21 [15]</span>";
        Assert.Equal(expected, viewModel.Choice);
    }

    [Theory]
    [InlineData(true, null)]
    [InlineData(false, "Next Odd/Even")]
    public void GetTicket_CheckIsRecover_ReturnViewWithBetTypeName(bool isRecover, string expected)
    {
        // Arrange
        var item = new GetTicketModel { BetType = 86 };
        var betListService = Substitute.For<BetListService>();
        var mapper = Substitute.For<IMapper>();
        mapper.Map<Ticket>(null).ReturnsForAnyArgs(new Ticket());
        betListService.GetBetType(item.BetType, LanguageCode.English).ReturnsForAnyArgs("Next Odd/Even");
        var service = new BetListCoreServiceImp(mapper, betListService);

        // Act
        var viewModel = service.GetTicket(item, isRecover);

        // Assert
        Assert.Equal(expected, viewModel.BetType);
    }
}