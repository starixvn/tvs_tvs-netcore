using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Services.GetTickets;

public class MapTicketServiceTests : IClassFixture<RemotingRefFixture>
{
    [Theory]
    [InlineData(true, 29, 1, 1)]
    [InlineData(false, 29, 1, 29)]
    public void MapToTicketViewModel_IsMixParlay_SetBetTypeBySubTicket(bool isMixParlay, short betType, int subBetType, int expected)
    {
        // Arrange
        var item = new GetTicketModel { IsMixParlay = isMixParlay, BetType = betType, SubBetType = subBetType };
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var mapTicketService = new MapTicketServiceImp(betListService, TestSetup.CreateMapper(), checkBoxService);
        // Act
        mapTicketService.MapToTicketViewModel(item, new Match(), new UserPermission());

        // Assert
        betListService.Received()
            .BuildChoice(Arg.Compat.Is<ITicket>(x => x.BetTypeId == expected), Arg.Compat.Any<TicketHelper>(), null, false);
    }

    [Theory]
    [InlineData(true, true, "FollowedUsername", 1, TicketStatus.Running)]
    [InlineData(false, false, "", 0, TicketStatus.Won)]
    public void MapToTicketExcelModel_IsMixParlay_SetBetTypeBySubTicket(bool isLiveIndicator, bool secAcceptFlag, string followedUsername, int followedId, string status)
    {
        // Arrange
        var item = new GetTicketModel
        {
            IsLiveIndicator = isLiveIndicator,
            SecAcceptFlag = secAcceptFlag,
            FollowedUsername = followedUsername,
            FollowedId = followedId,
            Status = status
        };
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var mapTicketService = new MapTicketServiceImp(betListService, TestSetup.CreateMapper(), checkBoxService);
        // Act
        mapTicketService.MapToTicketExcelModel(item, new Match());

        // Assert
        betListService.Received()
            .BuildChoice(Arg.Any<ITicket>(), Arg.Any<TicketHelper>(), null, false);
    }
}