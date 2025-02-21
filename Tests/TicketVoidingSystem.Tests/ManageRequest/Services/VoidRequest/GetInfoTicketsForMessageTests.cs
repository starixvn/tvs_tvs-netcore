using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.SharedApi.Services.MessageTemplate;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class GetInfoTicketsForMessageTests
{
    [Theory]
    [InlineData(BetTypeConstant.OverUnder)]
    [InlineData(BetTypeConstant.FirstHalfOverUnder)]
    public void GetHdpValues_betTypeIdIsOverUnder_ReturnExpected(int betTypeId)
    {
        // Arrange
        List<GetTicketModel> allTickets =
            [new() { IsMixParlay = true, SubHdp1 = 1, SubHdp2 = 0 }, new() { IsMixParlay = false, Hdp1 = 2, Hdp2 = 1 }];
        var service = new GetInfoTicketsForMessageImp(null);

        // Act
        var actual = service.GetHdpValues(betTypeId, allTickets);

        // Assert
        Assert.Equal("1, 2", actual);
    }

    [Theory]
    [InlineData(BetTypeConstant.Handicap)]
    [InlineData(BetTypeConstant.FirstHalfHandicap)]
    public void GetHdpValues_betTypeIdIsHandicap_ReturnExpected(int betTypeId)
    {
        // Arrange
        List<GetTicketModel> allTickets =
            [new() { GroupBetTypeId = 1, IsMixParlay = true, SubHdp1 = 1, SubHdp2 = 0 }, new() { GroupBetTypeId = 1, IsMixParlay = false, Hdp1 = 2, Hdp2 = 1 }];
        var service = new GetInfoTicketsForMessageImp(null);

        // Act
        var actual = service.GetHdpValues(betTypeId, allTickets);

        // Assert
        Assert.Equal("1, 3", actual);
    }

    [Fact]
    public void GetSpecialBetTypeContent_HasCallGetContentForVoidPage()
    {
        // Arrange
        List<GetTicketModel> allTickets =
            [new() { IsMixParlay = true, SubHdp1 = 1, SubHdp2 = 0 }, new() { IsMixParlay = false, Hdp1 = 2, Hdp2 = 1 }];
        var specialBetTypeContentService = Substitute.For<SpecialBetTypeContentService>();
        var service = new GetInfoTicketsForMessageImp(specialBetTypeContentService);

        // Act
        service.GetSpecialBetTypeContent(allTickets);

        // Assert
        specialBetTypeContentService.Received(1).GetContentForVoidPage(Arg.Any<IEnumerable<TicketEmailModel>>());
    }

    [Fact]
    public void GetHdpValues_betTypeIdNotSpecial_ReturnExpected()
    {
        // Arrange
        List<GetTicketModel> allTickets =
            [new() { IsMixParlay = true, SubHdp1 = 1, SubHdp2 = 0 }, new() { IsMixParlay = false, Hdp1 = 2, Hdp2 = 1 }];
        var service = new GetInfoTicketsForMessageImp(null);

        // Act
        var actual = service.GetHdpValues(111, allTickets);

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void GetSpecialBetTeam_betTypeIdNotSpecial_ReturnExpected()
    {
        // Arrange
        List<GetTicketModel> allTickets =
            [new() { IsMixParlay = true, SubHdp1 = 1, SubHdp2 = 0 }, new() { IsMixParlay = false, Hdp1 = 2, Hdp2 = 1 }];
        var service = new GetInfoTicketsForMessageImp(null);

        // Act
        var actual = service.GetSpecialBetTeam(111, allTickets);

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void GetSpecialBetTeam_HasManyBetTeams_ReturnExpected()
    {
        // Arrange
        List<GetTicketModel> allTickets =
            [new() { IsMixParlay = true, SubHdp1 = 1, SubHdp2 = 0, SubBetTeam = "a", GroupBetTypeId = BetTypeConstant.Handicap },
                new() { IsMixParlay = false, Hdp1 = 2, Hdp2 = 1, BetTeam = "h", GroupBetTypeId = BetTypeConstant.Handicap}];
        var service = new GetInfoTicketsForMessageImp(null);

        // Act
        var actual = service.GetSpecialBetTeam(BetTypeConstant.Handicap, allTickets);

        // Assert
        Assert.Equal("All", actual);
    }

    [Fact]
    public void GetSpecialBetTeam_HasOnlyBetTeam_ReturnExpected()
    {
        // Arrange
        List<GetTicketModel> allTickets =
            [new() { IsMixParlay = true, SubHdp1 = 1, SubHdp2 = 0, SubBetTeam = "a", GroupBetTypeId = BetTypeConstant.Handicap },
                new() { IsMixParlay = false, Hdp1 = 2, Hdp2 = 1, BetTeam = "a", GroupBetTypeId = BetTypeConstant.Handicap }];
        var service = new GetInfoTicketsForMessageImp(null);

        // Act
        var actual = service.GetSpecialBetTeam(BetTypeConstant.Handicap, allTickets);

        // Assert
        Assert.Equal("a", actual);
    }
}