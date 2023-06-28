using TicketVoidingSystem.Services;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;
using System.Threading.Tasks;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;
using TicketVoidingSystem.Models;
using System.Collections.Generic;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public class GetVoidedTicketsWorkSheetServiceTests
{
	private readonly CellService cellService;
	private readonly GetVoidedTicketsService getVoidedTicketsService;
	private readonly GetVoidedTicketsForExcelService getVoidedTicketsForExcelService;
	private readonly MatchService matchService;

	private GetVoidedTicketsWorkSheetService service;

	public GetVoidedTicketsWorkSheetServiceTests()
	{
		cellService = Substitute.For<CellService>();
		getVoidedTicketsService = Substitute.For<GetVoidedTicketsService>();
		getVoidedTicketsForExcelService = Substitute.For<GetVoidedTicketsForExcelService>();
		matchService = Substitute.For<MatchService>();

		service = new GetVoidedTicketsWorkSheetService(cellService, getVoidedTicketsService, getVoidedTicketsForExcelService, matchService);
	}

	[Fact]
	public async Task BindingContent_SetsTitleAndInvokesMethods()
	{
		// Arrange
		var worksheet = SetupTestingSheet.CreateTestingSheet();

		var mockModel = new GetVoidedTicketsQuery
		{
			MatchId = 1,
		};
		var mockMatch = new Match
		{
			MatchId = 1,
		};
		getVoidedTicketsService.GetMatchInfo(Arg.Any<int>()).Returns(mockMatch);

		// Act
		await service.BindingContent(worksheet, mockModel);

		// Assert

		await getVoidedTicketsService.Received(1).GetMatchInfo(mockModel.MatchId.Value);
		matchService.Received(1).UpdateMatchInfoFromRemotingRef(mockMatch);
		cellService.Received(1).AddMatch(worksheet, mockMatch);
	}

	[Fact]
	public async Task BindingContent_AddTicketContentAndInvokesMethods()
	{
		// Arrange
		var worksheet = SetupTestingSheet.CreateTestingSheet();

		var mockModel = new GetVoidedTicketsQuery
		{
			MatchId = 1,
		};
		var mockMatch = new Match
		{
			MatchId = 1,
		};
		getVoidedTicketsService.GetMatchInfo(Arg.Any<int>()).Returns(mockMatch);
		getVoidedTicketsForExcelService.GetGroupsExcelTickets(Arg.Any<GetVoidedTicketsQuery>(), Arg.Any<Match>()).Returns(new List<Group<ExcelVoidedTicketModel>>
		{
			new Group<ExcelVoidedTicketModel>
			{
				Name = "Test",
			}
		});
		// Act
		await service.BindingContent(worksheet, mockModel);

		// Assert

		await getVoidedTicketsService.Received(1).GetMatchInfo(mockModel.MatchId.Value);
		matchService.Received(1).UpdateMatchInfoFromRemotingRef(mockMatch);
		cellService.Received(1).AddMatch(worksheet, mockMatch);
		cellService.Received(1).WriteGroupHeader(worksheet, Arg.Any<int>(), Arg.Any<Group<ExcelVoidedTicketModel>>());
	}
}