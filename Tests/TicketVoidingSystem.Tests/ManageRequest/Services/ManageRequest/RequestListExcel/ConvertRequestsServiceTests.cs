using Fanex.Data.Repository;
using NSubstitute;
using System.Collections.Generic;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel;

public class ConvertRequestsServiceTests
{
	private readonly IDynamicRepository repository;
	private ConvertRequestsServiceImp convertRequestsServiceImp;

	public ConvertRequestsServiceTests()
	{
		repository = Substitute.For<IDynamicRepository>();
		convertRequestsServiceImp = new ConvertRequestsServiceImp(repository);
	}

	[Fact]
	public async void GetAllIssueTypes_ReturnCorrect()
	{
		// Arrange
		repository.FetchAsync<IssueType>(Arg.Any<GetIssueTypeCriteria>()).Returns(new List<IssueType> { new IssueType() { } });
		// Act

		var result = await convertRequestsServiceImp.GetAllIssueTypes();

		// Assert
		Assert.Single(result);
	}

	[Fact]
	public async void GetAllSubIssueTypes_ReturnCorrect()
	{
		// Arrange
		repository.FetchAsync<SubIssueType>(Arg.Any<GetSubIssueTypeCriteria>()).Returns(new List<SubIssueType> { new SubIssueType() { } });
		// Act

		var result = await convertRequestsServiceImp.GetAllSubIssueTypes();

		// Assert
		Assert.Single(result);
	}

	[Fact]
	public async void GetAllVoidActions_ReturnCorrect()
	{
		// Arrange
		repository.FetchAsync<VoidAction>(Arg.Any<GetActionsCriteria>()).Returns(new List<VoidAction> { new VoidAction() { } });
		// Act

		var result = await convertRequestsServiceImp.GetAllVoidActions();

		// Assert
		Assert.Single(result);
	}

	[Fact]
	public void GetIssueTypeName_ReturnsCorrectTypeName()
	{
		// Arrange
		int issueId = 1;
		var issueTypes = new List<IssueType>
		{
			new IssueType { IssueTypeId = 1, IssueTypeName = "Bug" },
			new IssueType { IssueTypeId = 2, IssueTypeName = "Feature" },
			new IssueType { IssueTypeId = 3, IssueTypeName = "Improvement" }
		};

		// Act
		string typeName = convertRequestsServiceImp.GetIssueTypeName(issueId, issueTypes);

		// Assert
		Assert.Equal("Bug", typeName);
	}

	[Fact]
	public void GetIssueTypeName_ReturnsNullIfNotFound()
	{
		// Arrange
		int issueId = 4;
		var issueTypes = new List<IssueType>
		{
			new IssueType { IssueTypeId = 1, IssueTypeName = "Bug" },
			new IssueType { IssueTypeId = 2, IssueTypeName = "Feature" },
			new IssueType { IssueTypeId = 3, IssueTypeName = "Improvement" }
		};

		// Act
		string typeName = convertRequestsServiceImp.GetIssueTypeName(issueId, issueTypes);

		// Assert
		Assert.Null(typeName);
	}

	[Theory]
	[InlineData(IssueTypeConstant.AbnormalBet, "<div class='text-primary total-single'>abc</div>")]
	[InlineData(IssueTypeConstant.AbnormalBetRealMember, "<div class='text-primary total-parlay'>abc</div>")]
	[InlineData(IssueTypeConstant.DangerAccepted, "<div class='void-time'>abc</div>")]
	[InlineData(IssueTypeConstant.EarlyKickOffTime, "<div class='ko-time'>abc</div>")]
	[InlineData(IssueTypeConstant.WrongScore, "<div class='void-wrong-score'>abc</div>")]
	[InlineData(IssueTypeConstant.ArchivedTicket, "<div class='text-primary total-single'>abc</div><div class='text-primary total-parlay'>abc</div>")]
	[InlineData(IssueTypeConstant.AbnormalAccount, "<div class='void-time'>abc</div><div class='text-primary total-account'>abc</div>")]
	public void GetDescription_ReturnsExpectedDescription(int issueId, string html)
	{
		// Arrange

		// Act
		string description = convertRequestsServiceImp.GetDescription(issueId, html);

		// Assert
		Assert.NotNull(description);
		// Add additional assertions based on your specific requirements
	}

	[Fact]
	public void GetDescription_ReturnsEmptyStringForUnknownIssue()
	{
		// Arrange
		int issueId = 999; // Assuming 999 is not a valid issue ID
		string html = "Some HTML";

		// Act
		string description = convertRequestsServiceImp.GetDescription(issueId, html);

		// Assert
		Assert.Equal(string.Empty, description);
	}

	[Fact]
	public void GetSubIssueTypeName_ReturnsCorrectTypeName()
	{
		// Arrange
		int subIssueId = 1;
		var subIssueTypes = new List<SubIssueType>
		{
			new SubIssueType { SubIssueTypeId = 1, SubIssueTypeName = "SubIssueType1" },
			new SubIssueType { SubIssueTypeId = 2, SubIssueTypeName = "SubIssueType2" },
			new SubIssueType { SubIssueTypeId = 3, SubIssueTypeName = "SubIssueType3" }
		};

		// Act
		string typeName = convertRequestsServiceImp.GetSubIssueTypeName(subIssueId, subIssueTypes);

		// Assert
		Assert.Equal("SubIssueType1", typeName);
	}

	[Fact]
	public void GetSubIssueTypeName_ReturnsNullIfNotFound()
	{
		// Arrange
		int subIssueId = 4; // Assuming subIssueId 4 doesn't exist in the list
		var subIssueTypes = new List<SubIssueType>
		{
			new SubIssueType { SubIssueTypeId = 1, SubIssueTypeName = "SubIssueType1" },
			new SubIssueType { SubIssueTypeId = 2, SubIssueTypeName = "SubIssueType2" },
			new SubIssueType { SubIssueTypeId = 3, SubIssueTypeName = "SubIssueType3" }
		};

		// Act
		string typeName = convertRequestsServiceImp.GetSubIssueTypeName(subIssueId, subIssueTypes);

		// Assert
		Assert.Null(typeName);
	}

	[Fact]
	public void GetVoidActionName_ReturnsCorrectActionName()
	{
		// Arrange
		int id = 1;
		var voidActions = new List<VoidAction>
		{
			new VoidAction { ActionId = "1", ActionName = "Action1" },
			new VoidAction { ActionId = "2", ActionName = "Action2" },
			new VoidAction { ActionId = "3", ActionName = "Action3" }
		};

		// Act
		string actionName = convertRequestsServiceImp.GetVoidActionName(id, voidActions);

		// Assert
		Assert.Equal("Action1", actionName);
	}

	[Fact]
	public void GetVoidActionName_ReturnsNullIfNotFound()
	{
		// Arrange
		int id = 4; // Assuming id 4 doesn't exist in the list
		var voidActions = new List<VoidAction>
		{
			new VoidAction { ActionId = "1", ActionName = "Action1" },
			new VoidAction { ActionId = "2", ActionName = "Action2" },
			new VoidAction { ActionId = "3", ActionName = "Action3" }
		};

		// Act
		string actionName = convertRequestsServiceImp.GetVoidActionName(id, voidActions);

		// Assert
		Assert.Null(actionName);
	}

	[Fact]
	public void GetNoOfTickets_ReturnsEmptyStringWhenNoTickets()
	{
		// Arrange
		int single = 0;
		int parlay = 0;

		// Act
		string result = convertRequestsServiceImp.GetNoOfTickets(single, parlay);

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
		string result = convertRequestsServiceImp.GetNoOfTickets(single, parlay);

		// Assert
		Assert.Equal(expected, result);
	}

	[Fact]
	public void GetSportName_ValidHtml_ReturnsFirstSportClassName()
	{
		// Arrange
		string html = "<div><p class='sport'>Football</p><p class='sport'>Basketball</p></div>";

		// Act
		string result = convertRequestsServiceImp.GetSportName(html);

		// Assert
		Assert.Equal("Football", result);
	}

	[Fact]
	public void GetSportName_InValidInput_ReturnsEmptyStringWhenNoSportClassNodesFound()
	{
		// Arrange
		string html = "<div><p> content</p></div>";

		// Act
		string result = convertRequestsServiceImp.GetSportName(html);

		// Assert
		Assert.Equal(string.Empty, result);
	}

	[Fact]
	public void GetEvent_ValidHtml_ReturnsFirstMatchClassName()
	{
		// Arrange
		string html = "<div><p class='match'>Football Match 1</p><p class='match'>Football Match 2</p></div>";

		// Act
		string result = convertRequestsServiceImp.GetEvent(html);

		// Assert
		Assert.Equal("Football Match 1", result);
	}

	[Fact]
	public void GetEvent_InvalidHtml_ReturnsEmptyStringWhenNoMatchClassNodesFound()
	{
		// Arrange
		string html = "<div><p> content</p></div>";

		// Act
		string result = convertRequestsServiceImp.GetEvent(html);

		// Assert
		Assert.Equal(string.Empty, result);
	}

	[Fact]
	public void GetLeague_ValidHtml_ReturnsFirstLeague()
	{
		// Arrange
		string html = "<div><p class='league text-uppercase'>Premier League</p><p class='league text-uppercase'>La Liga</p></div>";

		// Act
		string result = convertRequestsServiceImp.GetLeague(html);

		// Assert
		Assert.Equal("Premier League", result);
	}

	[Fact]
	public void GetVarCheckValue_ReturnsCheckSymbolWhenChecked()
	{
		// Arrange
		bool isCheckedVar = true;

		// Act
		string result = convertRequestsServiceImp.GetVarCheckValue(isCheckedVar);

		// Assert
		Assert.Equal("√", result);
	}

	[Fact]
	public void GetVarCheckValue_ReturnsEmptyStringWhenNotChecked()
	{
		// Arrange
		bool isCheckedVar = false;

		// Act
		string result = convertRequestsServiceImp.GetVarCheckValue(isCheckedVar);

		// Assert
		Assert.Equal(string.Empty, result);
	}
}