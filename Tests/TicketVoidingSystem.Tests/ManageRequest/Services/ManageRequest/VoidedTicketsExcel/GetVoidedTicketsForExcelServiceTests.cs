using NSubstitute;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public class GetVoidedTicketsForExcelServiceTests
{
	private readonly GetVoidedTicketsService getVoidedTicketsService;
	private readonly MapTicketsExcelService mapTicketsExcelService;

	private GetVoidedTicketsForExcelServiceImp getVoidedTicketsForExcelService;

	public GetVoidedTicketsForExcelServiceTests()
	{
		getVoidedTicketsService = Substitute.For<GetVoidedTicketsService>();
		mapTicketsExcelService = Substitute.For<MapTicketsExcelService>();

		getVoidedTicketsForExcelService = new GetVoidedTicketsForExcelServiceImp(getVoidedTicketsService, mapTicketsExcelService);
	}

	[Fact]
	public async Task GetGroupsExcelTickets_WithValidData_ReturnsGroupedExcelTickets()
	{
		// Arrange
		var query = new GetVoidedTicketsQuery();
		var match = new Match();
		var expectedGroupsExcelTickets = new List<Group<ExcelVoidedTicketModel>>
		{
			new Group<ExcelVoidedTicketModel>
			{
				Name = "Test",
				Tickets = new List<ExcelVoidedTicketModel>()
			}
		};

		getVoidedTicketsService.GetTickets(Arg.Any<GetVoidedTicketsQuery>()).Returns(new List<VoidedTicketModel>());
		mapTicketsExcelService.MapToGroupVoidedTickets(Arg.Any<List<VoidedTicketModel>>()).Returns(new List<Group<VoidedTicketModel>>
		{
			new Group<VoidedTicketModel>
			{
				Name = "Test",
				Tickets = new List<VoidedTicketModel> {}
			}
		});
		mapTicketsExcelService.MapToGroupExcelVoidedTickets(Arg.Any<Group<VoidedTicketModel>>(), Arg.Any<Match>(), Arg.Any<int>(), Arg.Any<int>())
			.Returns(new Group<ExcelVoidedTicketModel>
			{
				Name = "Test",
				Tickets = new List<ExcelVoidedTicketModel> { }
			});

		// Act
		var actualGroupsExcelTickets = await getVoidedTicketsForExcelService.GetGroupsExcelTickets(query, match);

		// Assert
		Assert.Equal(expectedGroupsExcelTickets.Count(), actualGroupsExcelTickets.Count());
		mapTicketsExcelService.Received(1).MapToGroupVoidedTickets(Arg.Any<List<VoidedTicketModel>>());
	}
}