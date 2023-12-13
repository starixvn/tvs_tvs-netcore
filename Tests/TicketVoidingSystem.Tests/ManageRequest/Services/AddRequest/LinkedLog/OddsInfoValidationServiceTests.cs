using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class OddsInfoValidationServiceTests
{
    [Fact]
    public Task IsValidFavoriteWrongHdp1StHdp_NoHasHomeFavorite_ReturnTrue()
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp2 = 1 };
        var getLinkedLogModel = new GetLinkedLogModel { AwayFavorite = "1" };
        var service = new OddsInfoValidationServiceImp();

        // Act
        var actual = service.IsValidInputHdpForWrongHdp1StHdp(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.True(actual);
        return Task.CompletedTask;
    }

    [Theory]
    [InlineData("1")]
    [InlineData("")]
    public Task IsValidFavoriteWrongHdp1StHdp_HasHomeFavorite_ReturnFalse(string homeFavorite)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp1 = 2 };
        var getLinkedLogModel = new GetLinkedLogModel { HomeFavorite = homeFavorite };
        var service = new OddsInfoValidationServiceImp();

        // Act
        var actual = service.IsValidInputHdpForWrongHdp1StHdp(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.False(actual);
        return Task.CompletedTask;
    }

    [Theory]
    [InlineData(SubIssueTypeConstant.Handicap)]
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap)]
    [InlineData(SubIssueTypeConstant.OverUnder)]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder)]
    [InlineData(SubIssueTypeConstant.FixGame)]
    public Task IsValidBetTypeWrongOdds_ValidData_ReturnFalse(int subIssueTypeId)
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { SubIssueTypeId = subIssueTypeId };
        var service = new OddsInfoValidationServiceImp();

        // Act
        var actual = service.IsValidBetTypeWrongOdds(BetTypeConstant.BitCoinOverUnder, getLinkedLogModel);

        // Assert
        Assert.False(actual);
        return Task.CompletedTask;
    }

    [Theory]
    [InlineData(SubIssueTypeConstant.Handicap)]
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap)]
    [InlineData(SubIssueTypeConstant.OverUnder)]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder)]
    [InlineData(SubIssueTypeConstant.FixGame)]
    public Task IsValidLinkGroupWrongOdds_ValidData_ReturnFalse(int subIssueTypeId)
    {
        // Arrange
        var linkedLog = new PoolHouseLinkedLogResponse { LinkGroup = 100 };
        var getLinkedLogModel = new GetLinkedLogModel { SubIssueTypeId = subIssueTypeId };
        var service = new OddsInfoValidationServiceImp();

        // Act
        var actual = service.IsValidLinkGroupWrongOdds(linkedLog, getLinkedLogModel);

        // Assert
        Assert.False(actual);
        return Task.CompletedTask;
    }

    [Theory]
    [InlineData(SubIssueTypeConstant.Handicap, 1)]
    [InlineData(SubIssueTypeConstant.Handicap, 2)]
    [InlineData(SubIssueTypeConstant.OverUnder, 2)]
    [InlineData(SubIssueTypeConstant.OverUnder, 1)]
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap, 2)]
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap, 3)]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, 2)]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, 3)]
    public Task IsValidLinkGroupWrongOdds_ValidData_ReturnTrue(int subIssueTypeId, int linkGroup)
    {
        // Arrange
        var linkedLog = new PoolHouseLinkedLogResponse { LinkGroup = linkGroup };
        var getLinkedLogModel = new GetLinkedLogModel { SubIssueTypeId = subIssueTypeId };
        var service = new OddsInfoValidationServiceImp();

        // Act
        var actual = service.IsValidLinkGroupWrongOdds(linkedLog, getLinkedLogModel);

        // Assert
        Assert.True(actual);
        return Task.CompletedTask;
    }

    [Theory]
    [InlineData(SubIssueTypeConstant.Handicap, FilterTypeWrongOddsConstant.FilterFavoriteTypeHome, "")]
    [InlineData(SubIssueTypeConstant.Handicap, FilterTypeWrongOddsConstant.FilterFavoriteTypeAway, "")]
    [InlineData(SubIssueTypeConstant.Handicap, "", "")]
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap, FilterTypeWrongOddsConstant.FilterFavoriteTypeHome, "")]
    [InlineData(SubIssueTypeConstant.OverUnder, "", FilterTypeWrongOddsConstant.FilterOuTypeHome)]
    [InlineData(SubIssueTypeConstant.OverUnder, "", FilterTypeWrongOddsConstant.FilterOuTypeAway)]
    [InlineData(SubIssueTypeConstant.OverUnder, "", "")]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, "", FilterTypeWrongOddsConstant.FilterOuTypeAway)]
    [InlineData(99, FilterTypeWrongOddsConstant.FilterOuTypeAway, "")]
    public void IsValidHdpWrongOdds_ValidData_ReturnFalse(int subIssueTypeId, string filterFavoriteType,
        string filterOuType)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp1 = 1, Hdp2 = 1, Odds1a = 2, Odds2a = 2 };
        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = subIssueTypeId,
            FilterFavoriteType = filterFavoriteType,
            FavoriteValue = "9",
            OddsValue = "8",
            FilterOuType = filterOuType
        };
        var service = new OddsInfoValidationServiceImp();

        // Act
        var actual = service.IsValidHdpWrongOdds(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.False(actual);
    }

    [Theory]
    [InlineData(SubIssueTypeConstant.Handicap, "", FilterTypeWrongOddsConstant.BetTeamHome,
        FilterTypeWrongOddsConstant.FilterOddsTypeValue)]
    [InlineData(SubIssueTypeConstant.Handicap, "", FilterTypeWrongOddsConstant.BetTeamHome,
        FilterTypeWrongOddsConstant.FilterOddsTypeRange)]
    [InlineData(SubIssueTypeConstant.Handicap, "", FilterTypeWrongOddsConstant.BetTeamHome, "")]
    [InlineData(SubIssueTypeConstant.Handicap, "", FilterTypeWrongOddsConstant.BetTeamAway,
        FilterTypeWrongOddsConstant.FilterOddsTypeValue)]
    [InlineData(SubIssueTypeConstant.FirstHalfHandicap, "", "", "")]
    [InlineData(SubIssueTypeConstant.OverUnder, FilterTypeWrongOddsConstant.FilterOuTypeHome,
        FilterTypeWrongOddsConstant.BetTeamHome, FilterTypeWrongOddsConstant.FilterOddsTypeRange)]
    [InlineData(SubIssueTypeConstant.OverUnder, FilterTypeWrongOddsConstant.FilterOuTypeHome,
        FilterTypeWrongOddsConstant.BetTeamHome, "")]
    [InlineData(SubIssueTypeConstant.OverUnder, FilterTypeWrongOddsConstant.FilterOuTypeHome,
        FilterTypeWrongOddsConstant.BetTeamAway, FilterTypeWrongOddsConstant.FilterOddsTypeRange)]
    [InlineData(SubIssueTypeConstant.OverUnder, FilterTypeWrongOddsConstant.FilterOuTypeAway,
        FilterTypeWrongOddsConstant.BetTeamAway, "")]
    [InlineData(SubIssueTypeConstant.OverUnder, "", "", "")]
    [InlineData(SubIssueTypeConstant.FirstHalfOverUnder, FilterTypeWrongOddsConstant.FilterOuTypeAway,
        FilterTypeWrongOddsConstant.BetTeamAway, "")]
    [InlineData(99, "", FilterTypeWrongOddsConstant.BetTeamAway, "")]
    public void IsValidOddsWrongOdds_ValidData_ReturnFalse(int subIssueTypeId, string filterOuType, string betTeam,
        string filterOddsType)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp1 = 1, Hdp2 = 1, Odds1a = 2, Odds2a = 2 };
        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = subIssueTypeId,
            FavoriteValue = "9",
            BetTeam = betTeam,
            OddsValue = "8",
            FromOdds = "11",
            ToOdds = "22",
            FilterOuType = filterOuType,
            FilterOddsType = filterOddsType
        };
        var service = new OddsInfoValidationServiceImp();

        // Act
        var actual = service.IsValidOddsWrongOdds(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.False(actual);
    }

    [Fact]
    public void IsValidOddsWrongOdds_ValidData_ReturnTrue()
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp1 = 1, Hdp2 = 1, Odds1a = 10, Odds2a = 2 };
        var getLinkedLogModel = new GetLinkedLogModel
        {
            SubIssueTypeId = 120,
            FavoriteValue = "9",
            OddsValue = "8",
            FromOdds = "1",
            ToOdds = "100",
            FilterOuType = "h",
            FilterOddsType = FilterTypeWrongOddsConstant.FilterOddsTypeRange
        };
        var service = new OddsInfoValidationServiceImp();

        // Act
        var actual = service.IsValidOddsWrongOdds(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.True(actual);
    }
}