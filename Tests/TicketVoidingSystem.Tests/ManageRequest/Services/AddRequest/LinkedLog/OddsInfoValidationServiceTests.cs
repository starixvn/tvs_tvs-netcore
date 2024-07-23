using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class OddsInfoValidationServiceTests
{
    [Theory]
    [InlineData("", 0, "1", 1)]
    [InlineData("1", 1, "", 0)]
    public Task IsValidFavoriteWrongHdp1StHdp_ReturnTrue(string homeFavorite, int hdp1, string awayFavorite, int hdp2)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp2 = hdp2, Hdp1 = hdp1 };
        var getLinkedLogModel = new GetLinkedLogModel { AwayFavorite = awayFavorite, HomeFavorite = homeFavorite, SubIssueTypeId = SubIssueTypeConstant.Wrong1stHDP };
        var service = new LinkedLogValidationServiceImp();

        // Act
        var actual = service.IsValidInputHdpForWrongHdp1StHdp(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.True(actual);
        return Task.CompletedTask;
    }

    [Fact]
    public Task SubTypeIsWrongHDPAwayVirtualHeadReversed_ReturnTrue()
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp2 = 1 };
        var getLinkedLogModel = new GetLinkedLogModel { HdpValue = "1", SubIssueTypeId = SubIssueTypeConstant.WrongHDPAwayVirtualHeadReversed };
        var service = new LinkedLogValidationServiceImp();

        // Act
        var actual = service.IsValidInputHdpForWrongHdp1StHdp(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.True(actual);
        return Task.CompletedTask;
    }

    [Fact]
    public Task SubTypeIsOverUnder_ReturnTrue()
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Hdp2 = 1 };
        var getLinkedLogModel = new GetLinkedLogModel { HdpValue = "1", SubIssueTypeId = SubIssueTypeConstant.OverUnder };
        var service = new LinkedLogValidationServiceImp();

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
        var getLinkedLogModel = new GetLinkedLogModel { HomeFavorite = homeFavorite, SubIssueTypeId = SubIssueTypeConstant.Wrong1stHDPHomeVirtualHeadReversed };
        var service = new LinkedLogValidationServiceImp();

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
        var service = new LinkedLogValidationServiceImp();

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
        var service = new LinkedLogValidationServiceImp();

        // Act
        var actual = service.IsLinkGroupWrongOdds(linkedLog, getLinkedLogModel);

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
        var service = new LinkedLogValidationServiceImp();

        // Act
        var actual = service.IsLinkGroupWrongOdds(linkedLog, getLinkedLogModel);

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
            WrongOU = "1"
        };
        var service = new LinkedLogValidationServiceImp();

        // Act
        var actual = service.IsValidHdpWrongOdds(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.False(actual);
    }

    [Fact]
    public void IsValidOddsWrongOdds_ValidData_ReturnFalse()
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Odds1a = 4, Odds2a = 8 };
        var getLinkedLogModel = new GetLinkedLogModel
        {
            FromOddsNotVoidHomeOver = "3",
            ToOddsNotVoidHomeOver = "9",
            FromOddsNotVoidAwayUnder = "3",
            ToOddsNotVoidAwayUnder = "9"
        };

        // Act
        var actual = LinkedLogValidationServiceImp.IsValidOddsWrongOdds(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.False(actual);
    }

    [Theory]
    [InlineData("5", "9", "3", "9")]
    [InlineData("3", "6", "3", "9")]
    [InlineData("3", "9", "5", "9")]
    [InlineData("3", "9", "3", "6")]
    public void IsValidOddsWrongOdds_ValidData_ReturnTrue(string fromOddsNotVoidHomeOver, string toOddsNotVoidHomeOver, string fromOddsNotVoidAwayUnder, string toOddsNotVoidAwayUnder)
    {
        // Arrange
        var linkedOddsInfo = new LinkedOddsInfo { Odds1a = 4, Odds2a = 8 };
        var getLinkedLogModel = new GetLinkedLogModel
        {
            FromOddsNotVoidHomeOver = fromOddsNotVoidHomeOver,
            ToOddsNotVoidHomeOver = toOddsNotVoidHomeOver,
            FromOddsNotVoidAwayUnder = fromOddsNotVoidAwayUnder,
            ToOddsNotVoidAwayUnder = toOddsNotVoidAwayUnder
        };
        var service = new LinkedLogValidationServiceImp();

        // Act
        var actual = service.IsValidOddsWrongOdds(linkedOddsInfo, getLinkedLogModel);

        // Assert
        Assert.True(actual);
    }
}