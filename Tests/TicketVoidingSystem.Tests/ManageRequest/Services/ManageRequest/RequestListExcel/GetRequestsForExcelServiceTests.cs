using AutoMapper;
using NSubstitute;
using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel;
public class GetRequestsForExcelServiceTests
{
    private readonly IMapper mapper;
    private readonly GetRequestsService getRequestsService;
    private readonly CalculateTimeService calculateTimeService;
    private readonly RenderRequestService renderService;
    private readonly ConvertRequestsService convertRequestsService;

    private GetRequestsForExcelServiceImp service;

    public GetRequestsForExcelServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        getRequestsService = Substitute.For<GetRequestsService>();
        calculateTimeService = Substitute.For<CalculateTimeService>();
        renderService = Substitute.For<RenderRequestService>();
        convertRequestsService = Substitute.For<ConvertRequestsService>();


        service = new GetRequestsForExcelServiceImp(mapper, getRequestsService, calculateTimeService, renderService, convertRequestsService);
    }

    [Fact]
    public async void GetRequestsExcel_DefaultQuery_ReturnEmpty()
    {
        // Arrange
        var query = new SelectRequestsQuery();
        getRequestsService.GetRequests(Arg.Any<SelectRequestsQuery>()).Returns((new List<RequestModel>(), new List<string>()));
        calculateTimeService.GetCalculateTime(Arg.Any<List<string>>()).Returns(new List<GetCalculateTimeModel>());
        renderService.RenderExportExcel(Arg.Any<RequestModel>()).Returns(new RequestViewModel());
        convertRequestsService.GetAllIssueTypes().Returns(new List<IssueType> { new IssueType { } });
        convertRequestsService.GetAllSubIssueTypes().Returns(new List<SubIssueType> { new SubIssueType { } });
        convertRequestsService.GetAllVoidActions().Returns(new List<VoidAction> { new VoidAction { } });

        // Act

        var result = await service.GetRequestsExcel(query);

        // Assert
        Assert.Empty(result);


    }

    [Fact]
    public async void GetRequestsExcel_DefaultQuery_ReturnCorrect()
    {
        // Arrange
        var query = new SelectRequestsQuery();
        var models = new List<RequestModel>
        {
            new () { RequestId = 1 },
            new  ()  { RequestId = 2 },
            new  ()  { RequestId = 1 },
        };

        var calculateTimeSets = new List<GetCalculateTimeModel>
        {
            new GetCalculateTimeModel { RequestId = 1 }
        };
        var renderedViewModels = new RequestViewModel
        {
            BettypeNames = new List<string> { "av" },
            Details = new List<RequestEventViewModel> { new RequestEventViewModel
            {
                MatchId = 1,
            }
            }
        };

        var outputRequests = new List<RequestModel>
        {
            new RequestModel {RequestId = 1},
            new RequestModel { RequestId = 2 },
            new RequestModel {RequestId = 1}
        };
        getRequestsService.GetRequests(Arg.Any<SelectRequestsQuery>()).Returns((models, new List<string>()));
        calculateTimeService.GetCalculateTime(Arg.Any<List<string>>()).Returns(calculateTimeSets);
        renderService.RenderExportExcel(Arg.Any<RequestModel>()).Returns(renderedViewModels);
        convertRequestsService.GetAllIssueTypes().Returns(new List<IssueType> { new IssueType { } });
        convertRequestsService.GetAllSubIssueTypes().Returns(new List<SubIssueType> { new SubIssueType { } });
        convertRequestsService.GetAllVoidActions().Returns(new List<VoidAction> { new VoidAction { } });
        mapper.Map<ExcelRequestModel>(Arg.Any<RequestViewModel>()).Returns(new ExcelRequestModel { MatchId = "12" });
        // Act

        var result = await service.GetRequestsExcel(query);

        // Assert
        Assert.Equal(outputRequests.Count(), result.Count());


    }
}
