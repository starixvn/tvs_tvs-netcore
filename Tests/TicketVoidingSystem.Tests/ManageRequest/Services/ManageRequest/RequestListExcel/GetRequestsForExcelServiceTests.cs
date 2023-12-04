using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel;

public class GetRequestsForExcelServiceTests
{
    private readonly CalculateTimeService calculateTimeService;
    private readonly ConvertRequestsService convertRequestsService;
    private readonly GetRequestsService getRequestsService;
    private readonly IMapper mapper;
    private readonly RenderRequestService renderService;

    private readonly GetRequestsForExcelServiceImp service;

    public GetRequestsForExcelServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        getRequestsService = Substitute.For<GetRequestsService>();
        calculateTimeService = Substitute.For<CalculateTimeService>();
        renderService = Substitute.For<RenderRequestService>();
        convertRequestsService = Substitute.For<ConvertRequestsService>();


        service = new GetRequestsForExcelServiceImp(mapper, getRequestsService, calculateTimeService, renderService,
            convertRequestsService);
    }

    [Fact]
    public async Task GetRequestsExcel_DefaultQuery_ReturnEmpty()
    {
        // Arrange
        var query = new SelectRequestsQuery();
        getRequestsService.GetRequests(Arg.Any<SelectRequestsQuery>())
            .Returns((new List<RequestModel>(), new List<string>()));
        calculateTimeService.GetCalculateTime(Arg.Any<List<string>>()).Returns(new List<GetCalculateTimeModel>());
        renderService.RenderExportExcel(Arg.Any<RequestModel>()).Returns(new RequestViewModel());
        convertRequestsService.GetAllIssueTypes().Returns(new List<IssueType> { new() });
        convertRequestsService.GetAllSubIssueTypes().Returns(new List<SubIssueType> { new() });
        convertRequestsService.GetAllVoidActions().Returns(new List<VoidAction> { new() });

        // Act

        var result = await service.GetRequestsExcel(query);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetRequestsExcel_DefaultQuery_ReturnCorrect()
    {
        // Arrange
        var query = new SelectRequestsQuery();
        var models = new List<RequestModel>
        {
            new() { RequestId = 1 },
            new() { RequestId = 2 },
            new() { RequestId = 1 }
        };

        var calculateTimeSets = new List<GetCalculateTimeModel>
        {
            new() { RequestId = 1 }
        };
        var renderedViewModels = new RequestViewModel
        {
            BettypeNames = new List<string> { "av" },
            Details = new List<RequestEventViewModel>
            {
                new()
                {
                    MatchId = 1
                },
                new()
            },
            CalcFullTime = new DateTime(2023, 2, 2, 2, 2, 2),
            CalcHalfTime = new DateTime(2023, 2, 2, 2, 2, 2)
        };

        var outputRequests = new List<RequestModel>
        {
            new() { RequestId = 1 },
            new() { RequestId = 2 },
            new() { RequestId = 1 }
        };
        getRequestsService.GetRequests(Arg.Any<SelectRequestsQuery>()).Returns((models, new List<string>()));
        calculateTimeService.GetCalculateTime(Arg.Any<List<string>>()).Returns(calculateTimeSets);
        renderService.RenderExportExcel(Arg.Any<RequestModel>()).Returns(renderedViewModels);
        convertRequestsService.GetAllIssueTypes().Returns(new List<IssueType> { new() });
        convertRequestsService.GetAllSubIssueTypes().Returns(new List<SubIssueType> { new() });
        convertRequestsService.GetAllVoidActions().Returns(new List<VoidAction> { new() });
        mapper.Map<ExcelRequestModel>(Arg.Any<RequestViewModel>()).Returns(new ExcelRequestModel { MatchId = "12" });

        // Act
        var result = await service.GetRequestsExcel(query);

        // Assert
        Assert.Equal(outputRequests.Count, result.Count());
    }
}