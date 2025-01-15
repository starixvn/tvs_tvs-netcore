using System;
using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Extension;

public class LogInfoExtensionTests
{
    [Fact]
    public void GetKickOffInfoXml_NoHasKickOffTime_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel>();

        // Act
        var result = models.ToKickOffInfoXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetKickOffInfoXml_HasDataViewModel_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel> { new() { MatchId = 1 } };

        // Act
        var result = models.ToKickOffInfoXml();

        // Assert
        Assert.Equal("<root><r MatchId='1' KickOffTime=''/></root>", result);
    }

    [Fact]
    public void GetKickOffInfoXml_NoHasKickOffTimeInDataViewModel_ReturnExpected()
    {
        // Arrange
        var models = new List<EarlyKickOffViewModel> { new() { MatchId = 1, KickOffTime = new DateTime(2023, 2, 2) } };

        // Act
        var result = models.ToKickOffInfoXml();

        // Assert
        Assert.Equal("<root><r MatchId='1' KickOffTime='02/01/2023 12:00:00'/></root>", result);
    }

    [Fact]
    public void ToTechnicalErrorInfoXml_HasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new TechnicalErrorViewModel
        {
            MatchId = 745632,
            FilterFromTransTime = new DateTime(2025, 2, 2),
            FilterToTransTime = new DateTime(2025, 2, 2),
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId = '745632' FilterFromTransTime='2025-02-02 00:00:00.000' FilterToTransTime='2025-02-02 00:00:00.000' " +
                                "SubIssueTypeId='3' AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToTechnicalErrorInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToTechnicalErrorInfoXml_NoHasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new TechnicalErrorViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId = '745632' FilterFromTransTime='' FilterToTransTime='' " +
                                "SubIssueTypeId='3' AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToTechnicalErrorInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToOtherIssuesInfoXml_HasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new OtherIssuesViewModel
        {
            MatchId = 745632,
            FilterFromTransTime = new DateTime(2025, 2, 2),
            FilterToTransTime = new DateTime(2025, 2, 2),
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId = '745632' SubIssueTypeId='3' FilterFromTransTime='2025-02-02 00:00:00.000' FilterToTransTime='2025-02-02 00:00:00.000' " +
                                "AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToOtherIssuesInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToOtherIssuesInfoXml_NoHasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new OtherIssuesViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3
        };
        const string expected = "<root><r MatchId = '745632' SubIssueTypeId='3' FilterFromTransTime='' FilterToTransTime='' " +
                                "AdvancedExtraInfo='null'/></root>";

        // Act
        var result = model.ToOtherIssuesInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongOfferedNameInfoXml_ReturnExpected()
    {
        // Arrange
        var model = new WrongOfferedNameViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3,
            CurrencyIds = "1",
            LicenseeNames = "LicenseeNames"
        };
        const string expected = "<root><r MatchId = '745632' CurrencyIds='1' LicenseeNames='LicenseeNames' SubIssueTypeId='3'/></root>";

        // Act
        var result = model.ToWrongOfferedNameInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongOddsSportsBookInfoXml_HasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new WrongOddsSportsBookViewModel
        {
            MatchId = 745632,
            FilterFromTransTime = new DateTime(2025, 2, 2),
            FilterToTransTime = new DateTime(2025, 2, 2),
            SubIssueTypeId = 3,
            LiveIndicator = 1,
            FilterOddsType = "1",
            OddsValue = "0.89",
            FromOdds = "0.6",
            ToOdds = "0.89",
            CorrectOdds = "0.9",
            BetTeamsResult = []
        };
        const string expected = "<root><r MatchId = '745632' FilterFromTransTime='2025-02-02 00:00:00.000' FilterToTransTime='2025-02-02 00:00:00.000' " +
                                "SubIssueTypeId='3' LiveIndicator='1' FilterOddsType='1' OddsValue='0.89' FromOdds='0.6' " +
                                "ToOdds='0.89' CorrectOdds='0.9' AdvancedExtraInfo='[]'/></root>";

        // Act
        var result = model.ToWrongOddsSportsBookInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongOddsSportsBookInfoXml_NoHasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new WrongOddsSportsBookViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3,
            LiveIndicator = 1,
            FilterOddsType = "1",
            OddsValue = "0.89",
            FromOdds = "0.6",
            ToOdds = "0.89",
            CorrectOdds = "0.9",
            BetTeamsResult = [new BetTeamAddRequestResult { BetIdX = "01", FilterBetIdX = "01" }]
        };
        const string expected = "<root><r MatchId = '745632' FilterFromTransTime='' FilterToTransTime='' SubIssueTypeId='3' LiveIndicator='1' " +
                                "FilterOddsType='1' OddsValue='0.89' FromOdds='0.6' ToOdds='0.89' CorrectOdds='0.9' " +
                                "AdvancedExtraInfo='[{&quot;BetIdX&quot;:&quot;01&quot;,&quot;FilterBetIdX&quot;:&quot;01&quot;}]'/></root>";

        // Act
        var result = model.ToWrongOddsSportsBookInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongMarketOfferedInfoXml_HasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new WrongMarketOfferedViewModel
        {
            MatchId = 745632,
            FilterFromTransTime = new DateTime(2025, 2, 2),
            FilterToTransTime = new DateTime(2025, 2, 2),
            SubIssueTypeId = 3,
            BetTeamsResult = []
        };
        const string expected = "<root><r MatchId='745632' Id='0' FilterFromTransTime='2025-02-02 00:00:00.000' FilterToTransTime='2025-02-02 00:00:00.000' " +
                                "SubIssueTypeId='3' AdvancedExtraInfo='[]' /></root>";
        List<WrongMarketOfferedViewModel> models = [model];

        // Act
        var result = models.ToWrongMarketOfferedInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongMarketOfferedInfoXml_NoHasDataFilterTime_ReturnExpected()
    {
        // Arrange
        var model = new WrongMarketOfferedViewModel
        {
            MatchId = 745632,
            SubIssueTypeId = 3,
            BetTeamsResult = []
        };
        const string expected = "<root><r MatchId='745632' Id='0' FilterFromTransTime='' FilterToTransTime='' " +
                                "SubIssueTypeId='3' AdvancedExtraInfo='[]' /></root>";
        List<WrongMarketOfferedViewModel> models = [model];

        // Act
        var result = models.ToWrongMarketOfferedInfoXml();

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void ToWrongMarketOfferedInfoXml_NoHasModel_ReturnEmpty()
    {
        // Arrange
        List<WrongMarketOfferedViewModel> models = [];

        // Act
        var result = models.ToWrongMarketOfferedInfoXml();

        // Assert
        Assert.Equal(string.Empty, result);
    }
}