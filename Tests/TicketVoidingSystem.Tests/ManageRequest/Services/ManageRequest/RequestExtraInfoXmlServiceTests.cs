using System.Collections.Generic;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

public class RequestExtraInfoXmlServiceTests
{
    [Fact]
    public void UpdateRequestDetailProperties_IssueTypeIsWrongMarketOffered_NotUpdateModels()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.WrongMarketOffered;
        const string requestExtraInfo = "<r IsLinkGroup1X2=\"1\" IsLinkGroupAIO=\"1\" LiveIndicator=\"0\" FilterFavoriteType=\"\" " +
                                        "FavoriteValue=\"\" WrongOU=\"1.75\" Spread=\"0.1\" AllowanceRate=\"25\"" +
                                        " CorrectOddsHomeOver=\"0.80\" CorrectOddsAwayUnder=\"-0.90\" FromOddsNotVoidHomeOver=\"0.55\" " +
                                        "ToOddsNotVoidHomeOver=\"-0.95\" FromOddsNotVoidAwayUnder=\"0.85\" ToOddsNotVoidAwayUnder=\"-0.65\" " +
                                        "PoolHouseCheckedBetTypes=\"All\" />";
        var models = new List<RequestEventModel> { new() { RequestExtraInfo = requestExtraInfo } };
        var service = new RequestExtraInfoXmlServiceImp();

        // Act
        service.UpdateRequestDetailProperties(issueTypeId, models);

        // Assert
        Assert.False(models[0].IsLinkGroup1X2);
    }

    [Fact]
    public void UpdateRequestDetailProperties_IssueTypeIsWrongOdds_UpdateModels()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.WrongOdds;
        const string requestExtraInfo = "<r IsLinkGroup1X2=\"1\" IsLinkGroupAIO=\"1\" LiveIndicator=\"0\" FilterFavoriteType=\"\" " +
                                        "FavoriteValue=\"\" WrongOU=\"1.75\" Spread=\"0.1\" AllowanceRate=\"25\"" +
                                        " CorrectOddsHomeOver=\"0.80\" CorrectOddsAwayUnder=\"-0.90\" FromOddsNotVoidHomeOver=\"0.55\" " +
                                        "ToOddsNotVoidHomeOver=\"-0.95\" FromOddsNotVoidAwayUnder=\"0.85\" ToOddsNotVoidAwayUnder=\"-0.65\" " +
                                        "PoolHouseCheckedBetTypes=\"All\" />";
        var models = new List<RequestEventModel> { new() { RequestExtraInfo = requestExtraInfo } };
        var service = new RequestExtraInfoXmlServiceImp();
        var expected = new List<RequestEventModel> { new() { IsLinkGroup1X2 = true,IsLinkGroupAIO=true, LiveIndicator=0, FilterFavoriteType="",
                FavoriteValue="",WrongOU="1.75", Spread="0.1", AllowanceRate="25",
                CorrectOddsHomeOver="0.80", CorrectOddsAwayUnder="-0.90", FromOddsNotVoidHomeOver="0.55",
                ToOddsNotVoidHomeOver="-0.95", FromOddsNotVoidAwayUnder="0.85", ToOddsNotVoidAwayUnder="-0.65",
                PoolHouseCheckedBetTypes="All", RequestExtraInfo = requestExtraInfo} };

        // Act
        service.UpdateRequestDetailProperties(issueTypeId, models);

        // Assert
        AssertExtension.Equal(expected, models);
    }

    [Fact]
    public void ParseXmlToIsCheckVar_IssueTypeIsWrongOdds_ReturnTrue()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.WrongOdds;
        const string requestExtraInfo = "<r IsLinkGroup1X2=\"1\" IsLinkGroupAIO=\"1\" LiveIndicator=\"0\" FilterFavoriteType=\"\" " +
                                        "FavoriteValue=\"\" WrongOU=\"1.75\" Spread=\"0.1\" AllowanceRate=\"25\"" +
                                        " CorrectOddsHomeOver=\"0.80\" CorrectOddsAwayUnder=\"-0.90\" FromOddsNotVoidHomeOver=\"0.55\" " +
                                        "ToOddsNotVoidHomeOver=\"-0.95\" FromOddsNotVoidAwayUnder=\"0.85\" ToOddsNotVoidAwayUnder=\"-0.65\" " +
                                        "PoolHouseCheckedBetTypes=\"All\" IsCheckedVar=\"1\"/>";
        var service = new RequestExtraInfoXmlServiceImp();

        // Act
        var actual = service.ParseXmlToIsCheckVar(issueTypeId, requestExtraInfo);

        // Assert
        Assert.True(actual);
    }

    [Fact]
    public void ParseXmlToIsCheckVar_IssueTypeIsTechnicalError_ReturnFalse()
    {
        // Arrange
        const int issueTypeId = IssueTypeConstant.TechnicalError;
        const string requestExtraInfo = "<r IsLinkGroup1X2=\"1\" IsLinkGroupAIO=\"1\" LiveIndicator=\"0\" FilterFavoriteType=\"\" " +
                                        "FavoriteValue=\"\" WrongOU=\"1.75\" Spread=\"0.1\" AllowanceRate=\"25\"" +
                                        " CorrectOddsHomeOver=\"0.80\" CorrectOddsAwayUnder=\"-0.90\" FromOddsNotVoidHomeOver=\"0.55\" " +
                                        "ToOddsNotVoidHomeOver=\"-0.95\" FromOddsNotVoidAwayUnder=\"0.85\" ToOddsNotVoidAwayUnder=\"-0.65\" " +
                                        "PoolHouseCheckedBetTypes=\"All\" IsCheckedVar=\"1\"/>";
        var service = new RequestExtraInfoXmlServiceImp();

        // Act
        var actual = service.ParseXmlToIsCheckVar(issueTypeId, requestExtraInfo);

        // Assert
        Assert.False(actual);
    }

    [Fact]
    public void ParseXmlToIsCheckVar_NoHasData_ReturnEmpty()
    {
        // Arrange
        const string operatorXml = "";
        var service = new RequestExtraInfoXmlServiceImp();

        // Act
        var actual = service.ParseXmlToOperators(operatorXml);

        // Assert
        Assert.Empty(actual);
    }
}