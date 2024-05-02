using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel;

public class ConvertRequestsServiceTests
{
    private readonly ConvertRequestsServiceImp convertRequestsServiceImp;
    private readonly IDynamicRepository repository;

    public ConvertRequestsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        convertRequestsServiceImp = new ConvertRequestsServiceImp(repository);
    }

    [Fact]
    public async Task GetAllIssueTypes_ReturnCorrect()
    {
        // Arrange
        repository.FetchAsync<IssueType>(Arg.Any<GetIssueTypeCriteria>()).Returns(new List<IssueType> { new() });

        // Act
        var result = await convertRequestsServiceImp.GetAllIssueTypes();

        // Assert
        Assert.Single(result);
    }

    [Fact]
    public async Task GetAllSubIssueTypes_ReturnCorrect()
    {
        // Arrange
        repository.FetchAsync<SubIssueType>(Arg.Any<GetSubIssueTypeCriteria>())
            .Returns(new List<SubIssueType> { new() });

        // Act
        var result = await convertRequestsServiceImp.GetAllSubIssueTypes();

        // Assert
        Assert.Single(result);
    }

    [Fact]
    public async Task GetAllVoidActions_ReturnCorrect()
    {
        // Arrange
        repository.FetchAsync<VoidAction>(Arg.Any<GetActionsCriteria>()).Returns(new List<VoidAction> { new() });

        // Act
        var result = await convertRequestsServiceImp.GetAllVoidActions();

        // Assert
        Assert.Single(result);
    }

    [Fact]
    public void GetIssueTypeName_ReturnsCorrectTypeName()
    {
        // Arrange
        var issueTypes = new List<IssueType>
        {
            new() { IssueTypeId = 1, IssueTypeName = "Bug" },
            new() { IssueTypeId = 2, IssueTypeName = "Feature" },
            new() { IssueTypeId = 3, IssueTypeName = "Improvement" }
        };

        // Act
        var typeName = convertRequestsServiceImp.GetIssueTypeName(1, issueTypes);

        // Assert
        Assert.Equal("Bug", typeName);
    }

    [Fact]
    public void GetIssueTypeName_ReturnsNullIfNotFound()
    {
        // Arrange
        var issueTypes = new List<IssueType>
        {
            new() { IssueTypeId = 1, IssueTypeName = "Bug" },
            new() { IssueTypeId = 2, IssueTypeName = "Feature" },
            new() { IssueTypeId = 3, IssueTypeName = "Improvement" }
        };

        // Act
        var typeName = convertRequestsServiceImp.GetIssueTypeName(4, issueTypes);

        // Assert
        Assert.Null(typeName);
    }

    [Theory]
    [InlineData(IssueTypeConstant.AbnormalBet, "<div class='text-primary total-single'>abc</div>", "Single: abc")]
    [InlineData(IssueTypeConstant.DangerAccepted, "<div class='void-time'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.RedCard, "<div class='void-time'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.WrongHDP, "<div class='void-time'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.Wrong1stHDP, "<div class='void-time'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.WrongOU, "<div class='void-time'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.Wrong1stOU, "<div class='void-time'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.WrongOdds, "<div class='void-time'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.WrongKickOffTime, "<div class='ko-time'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.EarlyKickOffTime, "<div class='ko-time'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.WrongScore, "<div class='void-wrong-score'>abc</div>", "abc")]
    [InlineData(IssueTypeConstant.ArchivedTicket,
        "<div class='text-primary total-single'>abc</div><div class='text-primary total-parlay'>abc</div>",
        "Single: abc, Parlay: abc")]
    [InlineData(IssueTypeConstant.AbnormalAccount,
        "<div class='void-time'></div><div class='text-primary total-account'>abc</div>", "No. of Account: abc")]
    [InlineData(IssueTypeConstant.ReducedOver, "<div class='text-primary total-single'>abc</div>", "")]
    [InlineData(IssueTypeConstant.DuplicateTickets, "<div class='text-primary total-single'>abc</div>", "Single: abc")]
    [InlineData(IssueTypeConstant.DuplicateTickets, "<div class='text-primary total-parlay'>abc</div>", "Parlay: abc")]
    [InlineData(IssueTypeConstant.DuplicateTickets, "<div>abc</div>", "")]
    [InlineData(999, "", "")]
    [InlineData(IssueTypeConstant.RecoverTicket,
        "<div>Product: <span class=\"text-primary product\">Sportsbook</span></div><div>Resettled: <span class=\"text-primary total-resettled\">0</span></div>", "Product: Sportsbook")]
    public void GetDescription_ReturnsExpectedDescription(int issueId, string html, string description)
    {
        // Arrange
        description = description.Replace("\r\n", Environment.NewLine);

        // Act
        var result = convertRequestsServiceImp.GetDescription(issueId, html);

        // Assert
        Assert.Equal(description, result);
    }

    [Fact]
    public void GetDescription_ReturnsEmptyStringForUnknownIssue()
    {
        // Arrange
        const int issueId = 999;
        const string html = "Some HTML";

        // Act
        var result = convertRequestsServiceImp.GetDescription(issueId, html);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetSubIssueTypeName_ReturnsCorrectTypeName()
    {
        // Arrange
        var subIssueTypes = new List<SubIssueType>
        {
            new() { SubIssueTypeId = 1, SubIssueTypeName = "SubIssueType1" },
            new() { SubIssueTypeId = 2, SubIssueTypeName = "SubIssueType2" },
            new() { SubIssueTypeId = 3, SubIssueTypeName = "SubIssueType3" }
        };

        // Act
        var typeName = convertRequestsServiceImp.GetSubIssueTypeName(1, subIssueTypes);

        // Assert
        Assert.Equal("SubIssueType1", typeName);
    }

    [Fact]
    public void GetSubIssueTypeName_ReturnsNullIfNotFound()
    {
        // Arrange
        var subIssueTypes = new List<SubIssueType>
        {
            new() { SubIssueTypeId = 1, SubIssueTypeName = "SubIssueType1" },
            new() { SubIssueTypeId = 2, SubIssueTypeName = "SubIssueType2" },
            new() { SubIssueTypeId = 3, SubIssueTypeName = "SubIssueType3" }
        };

        // Act
        var typeName = convertRequestsServiceImp.GetSubIssueTypeName(4, subIssueTypes);

        // Assert
        Assert.Null(typeName);
    }

    [Fact]
    public void GetVoidActionName_ReturnsCorrectActionName()
    {
        // Arrange
        var voidActions = new List<VoidAction>
        {
            new() { ActionId = "1", ActionName = "Action1" },
            new() { ActionId = "2", ActionName = "Action2" },
            new() { ActionId = "3", ActionName = "Action3" }
        };

        // Act
        var actionName = convertRequestsServiceImp.GetVoidActionName(1, voidActions);

        // Assert
        Assert.Equal("Action1", actionName);
    }

    [Fact]
    public void GetVoidActionName_ReturnsNullIfNotFound()
    {
        // Arrange
        var voidActions = new List<VoidAction>
        {
            new() { ActionId = "1", ActionName = "Action1" },
            new() { ActionId = "2", ActionName = "Action2" },
            new() { ActionId = "3", ActionName = "Action3" }
        };

        // Act
        var actionName = convertRequestsServiceImp.GetVoidActionName(4, voidActions);

        // Assert
        Assert.Null(actionName);
    }

    [Fact]
    public void GetNoOfTickets_ReturnsEmptyStringWhenNoTickets()
    {
        // Arrange

        // Act
        var result = convertRequestsServiceImp.GetNoOfTickets(0, 0);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Theory]
    [InlineData(1, 0, "1")]
    [InlineData(0, 3, "3")]
    [InlineData(2, 4, "6")]
    public void GetNoOfTickets_ReturnsCorrectTotal(int single, int parlay, string expected)
    {
        // Arrange

        // Act
        var result = convertRequestsServiceImp.GetNoOfTickets(single, parlay);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void GetSportName_ValidHtml_ReturnsFirstSportClassName()
    {
        // Arrange
        const string html = "<div><p class='sport'>Football</p><p class='sport'>Basketball</p></div>";

        // Act
        var result = convertRequestsServiceImp.GetSportName(html);

        // Assert
        Assert.Equal("Football", result);
    }

    [Fact]
    public void GetSportName_InValidInput_ReturnsEmptyStringWhenNoSportClassNodesFound()
    {
        // Arrange
        const string html = "<div><p> content</p></div>";

        // Act
        var result = convertRequestsServiceImp.GetSportName(html);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetEvent_ValidHtml_ReturnsFirstMatchClassName()
    {
        // Arrange
        const string html = "<div><p class='match'>Football Match 1</p><p class='match'>Football Match 2</p></div>";

        // Act
        var result = convertRequestsServiceImp.GetEvent(html);

        // Assert
        Assert.Equal("Football Match 1", result);
    }

    [Fact]
    public void GetEvent_InvalidHtml_ReturnsEmptyStringWhenNoMatchClassNodesFound()
    {
        // Arrange
        const string html = "<div><p> content</p></div>";

        // Act
        var result = convertRequestsServiceImp.GetEvent(html);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetLeague_ValidHtml_ReturnsFirstLeague()
    {
        // Arrange
        const string html =
            "<div><p class='league text-uppercase'>Premier League</p><p class='league text-uppercase'>La Lig</p></div>";

        // Act
        var result = convertRequestsServiceImp.GetLeague(html);

        // Assert
        Assert.Equal("Premier League", result);
    }

    [Fact]
    public void GetLeague_HtmlHasNotNodes_ReturnStringEmpty()
    {
        // Arrange
        const string html = "<div><p class='league'>Premier League</p>";

        // Act
        var result = convertRequestsServiceImp.GetLeague(html);

        // Assert
        Assert.Equal(string.Empty, result);
    }

    [Fact]
    public void GetVarCheckValue_ReturnsCheckSymbolWhenChecked()
    {
        // Arrange
        // Act
        var result = convertRequestsServiceImp.GetVarCheckValue(true);

        // Assert
        Assert.Equal("√", result);
    }

    [Fact]
    public void GetVarCheckValue_ReturnsEmptyStringWhenNotChecked()
    {
        // Arrange
        // Act
        var result = convertRequestsServiceImp.GetVarCheckValue(false);

        // Assert
        Assert.Equal(string.Empty, result);
    }
}