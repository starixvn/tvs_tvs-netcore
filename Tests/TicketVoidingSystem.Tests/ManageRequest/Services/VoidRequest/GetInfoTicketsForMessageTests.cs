using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.SharedApi.Criteria.BetTypes;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
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
        var service = new GetInfoTicketsForMessageImp(null, Substitute.For<BetTypesRepository>());

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
        var service = new GetInfoTicketsForMessageImp(null, Substitute.For<BetTypesRepository>());

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
        var service = new GetInfoTicketsForMessageImp(specialBetTypeContentService, Substitute.For<BetTypesRepository>());

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
        var service = new GetInfoTicketsForMessageImp(null, Substitute.For<BetTypesRepository>());

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
        var service = new GetInfoTicketsForMessageImp(null, Substitute.For<BetTypesRepository>());

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
        var service = new GetInfoTicketsForMessageImp(null, Substitute.For<BetTypesRepository>());

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
        var service = new GetInfoTicketsForMessageImp(null, Substitute.For<BetTypesRepository>());

        // Act
        var actual = service.GetSpecialBetTeam(BetTypeConstant.Handicap, allTickets);

        // Assert
        Assert.Equal("a", actual);
    }

    [Fact]
    public async Task GetAllNumberInnings_NotMatchEarlyCompleted_ReturnNull()
    {
        // Arrange
        List<GetTicketModel> voidTickets = [new() { BetType = 1 }];
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        var service = new GetInfoTicketsForMessageImp(null, betTypesRepository);

        // Act
        var actual = await service.GetAllNumberInnings(voidTickets, 999, 1);

        // Assert
        Assert.Null(actual);
    }

    [Fact]
    public async Task GetAllNumberInnings_MatchEarlyCompleted_ReturnExpected()
    {
        // Arrange
        List<GetTicketModel> voidTickets = [
            new() { BetType = 1, IsMixParlay = true, SubBetCheck = "801" },
            new() { BetType = 2, IsMixParlay = false, BetId = 802 }
        ];
        var betTypesViewModel = new BetTypesViewModel
        {
            BetTypes = new List<BetTypeModel>
            {
                new() { Id = "1", Name = "X Inning 1" },
                new() { Id = "2", Name = "X Inning 2" }
            }
        };
        var betTypesRepository = Substitute.For<BetTypesRepository>();
        betTypesRepository.GetBetTypes(Arg.Any<GetBetTypesCriteria>()).ReturnsForAnyArgs(betTypesViewModel);
        var service = new GetInfoTicketsForMessageImp(null, betTypesRepository);

        // Act
        var actual = await service.GetAllNumberInnings(voidTickets, IssueTypeConstant.MatchEarlyCompleted, 1);

        // Assert
        Assert.Equal("1,2", actual);
    }

    [Fact]
    public void GetSpecialBetTypeContent_ReturnExpected()
    {
        // Arrange
        List<GetTicketModel> allTickets = [
            new() { IsMixParlay = true, BetType = 1, BetId = 1, SubBetType = 1, SubBetCheck = "1" },
            new() { IsMixParlay = false, BetType = 2, BetId = 2, SubBetType = 2, SubBetCheck = "2" }
        ];
        var specialBetTypeContentService = Substitute.For<SpecialBetTypeContentService>();
        var expectedContent = new ContentByLanguageModel();
        specialBetTypeContentService.GetContentForVoidPage(Arg.Any<IEnumerable<TicketEmailModel>>())
            .Returns(expectedContent);
        var service = new GetInfoTicketsForMessageImp(specialBetTypeContentService, Substitute.For<BetTypesRepository>());

        // Act
        var actual = service.GetSpecialBetTypeContent(allTickets);

        // Assert
        Assert.NotNull(actual);
        Assert.Same(expectedContent, actual);
        specialBetTypeContentService.Received(1).GetContentForVoidPage(Arg.Any<IEnumerable<TicketEmailModel>>());
    }
}