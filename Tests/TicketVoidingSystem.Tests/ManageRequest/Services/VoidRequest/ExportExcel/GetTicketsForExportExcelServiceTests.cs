using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.ExportExcel;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest.ExportExcel;

public class GetTicketsForExportExcelServiceTests
{
    private readonly GetTicketsService getTicketsService;
    private readonly IMapper mapper;
    private readonly MapTicketsService mapTicketsService;
    private readonly PagingService pagingService;
    private readonly GetTicketsForExportExcelService service;

    public GetTicketsForExportExcelServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        getTicketsService = Substitute.For<GetTicketsService>();
        mapTicketsService = Substitute.For<MapTicketsService>();
        pagingService = Substitute.For<PagingService>();
        service = new GetTicketsForExportExcelServiceImp(mapper, getTicketsService, mapTicketsService, pagingService);
    }

    [Fact]
    public async Task MapToGroupTicketViewModel_HasNoTicket_ReturnNewListGroup()
    {
        // Arrange
        var query = new GetTicketsQuery();
        var data = new List<GetTicketModel>();
        getTicketsService.GetTickets(Arg.Any<GetTicketsQuery>()).Returns(data);
        var expected = new List<Group<ExcelTicketModel>>();

        // Act
        var result = await service.GetGroupsExcelTickets(query);

        // Assert

        AssertExtension.Equal(expected, result);
    }

    [Theory]
    [InlineData(38, IssueTypeConstant.DangerAccepted)]
    [InlineData(29, IssueTypeConstant.AbnormalAccount)]
    [InlineData(29, IssueTypeConstant.DangerAccepted)]
    public Task MapToGroupTicketViewModel_HasTicket_ReturnExpectedValue(short betType, int issueTypeId)
    {
        // Arrange
        var query = new GetTicketsQuery { IssueTypeId = issueTypeId };
        var data = new List<GetTicketModel>
        {
            new() { IsMixParlay = false, GroupName = "a" },
            new() { IsMixParlay = true, GroupName = "a" }
        };
        getTicketsService.GetTickets(Arg.Any<GetTicketsQuery>()).Returns(data);
        var groups = new List<Group<GetTicketModel>>
        {
            new()
            {
                Tickets = new List<GetTicketModel>
                {
                    new() { BetType = betType, IsMixParlay = true }
                }
            }
        };
        pagingService.Groups(Arg.Any<List<GetTicketModel>>(), default).ReturnsForAnyArgs(groups);
        var ticketDetail = new TicketViewModel
        {
            BetId = "1",
            Member = "a",
            Odds = "1",
            Status = "1",
            Choice = ""
        };
        var excelTicket = new ExcelTicketNoMatchModel();
        mapper.Map<ExcelTicketNoMatchModel>(Arg.Any<TicketViewModel>()).ReturnsForAnyArgs(excelTicket);
        mapTicketsService
            .MapFromGetTicketModelToTicketViewModel(Arg.Any<GetTicketModel>(), Arg.Any<Match>(), default, default)
            .ReturnsForAnyArgs(ticketDetail);

        mapper.Map<ExcelTicketModel>(Arg.Any<TicketViewModel>()).ReturnsForAnyArgs(new ExcelTicketModel());

        // Act
        var result = service.GetGroupsExcelTickets(query);

        // Assert

        Assert.NotNull(result);
        return Task.CompletedTask;
    }

    [Fact]
    public Task GetGroupsExcelTicketsRequestNoMatch_HasTicket_ReturnExpected()
    {
        // Arrange
        var query = new GetTicketsQuery();
        var data = new List<GetTicketModel>
        {
            new() { IsMixParlay = false, GroupName = "a" },
            new() { IsMixParlay = true, GroupName = "a" }
        };
        getTicketsService.GetTickets(Arg.Any<GetTicketsQuery>()).Returns(data);
        var groups = new List<Group<GetTicketModel>>
        {
            new()
            {
                Tickets = new List<GetTicketModel>
                {
                    new() { BetType = 38, IsMixParlay = true }
                }
            }
        };
        var ticketDetail = new TicketViewModel
        {
            BetId = "1",
            Member = "a",
            Odds = "1",
            Status = "1",
            Choice = "123"
        };
        pagingService.Groups(Arg.Any<List<GetTicketModel>>(), default).ReturnsForAnyArgs(groups);
        var excelTicket = new ExcelTicketNoMatchModel();
        mapper.Map<ExcelTicketNoMatchModel>(Arg.Any<TicketViewModel>()).ReturnsForAnyArgs(excelTicket);
        mapTicketsService
            .MapFromGetTicketModelToTicketViewModel(Arg.Any<GetTicketModel>(), Arg.Any<Match>(), default, default)
            .ReturnsForAnyArgs(ticketDetail);
        // Act
        var result = service.GetGroupsExcelTicketsRequestNoMatch(query);

        // Assert

        Assert.NotNull(result);
        return Task.CompletedTask;
    }

    [Fact]
    public async Task GetGroupsExcelTicketsRequestNoMatch_HasNoTicket_ReturnNewListGroup()
    {
        // Arrange
        var query = new GetTicketsQuery();
        var data = new List<GetTicketModel>();
        getTicketsService.GetTickets(Arg.Any<GetTicketsQuery>()).Returns(data);
        var expected = new List<Group<ExcelTicketNoMatchModel>>();

        // Act
        var result = await service.GetGroupsExcelTicketsRequestNoMatch(query);

        // Assert

        AssertExtension.Equal(expected, result);
    }
}