using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

public class RenderRequestServiceTests
{
    private readonly DescriptionService descriptionService;
    private readonly RenderRequestServiceImp manageRequestService;
    private readonly IMapper mapper;
    private readonly MatchService matchService;
    private readonly RemotingRefWrapperService remotingRefWrapperService;

    public RenderRequestServiceTests()
    {
        descriptionService = Substitute.For<DescriptionService>();
        mapper = Substitute.For<IMapper>();
        matchService = Substitute.For<MatchService>();
        remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        manageRequestService = new RenderRequestServiceImp(mapper, descriptionService, remotingRefWrapperService, matchService);
    }

    [Fact]
    public void Render_HasViewModel_ReturnValidViewModel()
    {
        // Arrange
        var requestModel = new RequestModel { CreatedDate = DateTime.Now };
        var groupRequestModel = new GroupRequestModel
        {
            RequestId = 123,
            RequestModels = new List<RequestModel> { requestModel }
        };
        var requestViewModel = new RequestViewModel();
        var requestDescription = new RequestDescription();
        var detail = new RequestEventViewModel();
        remotingRefWrapperService.GetTeamName(1, default, default).ReturnsForAnyArgs("aa");
        remotingRefWrapperService.GetLeagueName(1, default, default).ReturnsForAnyArgs("bb");
        mapper.Map<RequestEventViewModel>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(detail);
        descriptionService.Build(Arg.Any<RequestDescription>()).ReturnsForAnyArgs("abc");
        mapper.Map<RequestViewModel>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(requestViewModel);
        mapper.Map<RequestDescription>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(requestDescription);
        matchService.GetMatchEvent(Arg.Any<RequestDescription>()).Returns("A - B");

        // Act
        _ = manageRequestService.Render(groupRequestModel);

        // Assert
        descriptionService.Received(1).Build(Arg.Compat.Any<RequestDescription>());
    }

    [Fact]
    public void RenderExportExcel_HasViewModel_ReturnValidViewModel()
    {
        // Arrange
        var requestModel = new RequestModel { CreatedDate = DateTime.Now };
        var viewModel = new RequestViewModel();
        mapper.Map<RequestViewModel>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(viewModel);
        var requestDescription = new RequestDescription();
        var detail = new RequestEventViewModel();
        remotingRefWrapperService.GetTeamName(1, default, default).ReturnsForAnyArgs("aa");
        remotingRefWrapperService.GetLeagueName(1, default, default).ReturnsForAnyArgs("bb");
        mapper.Map<RequestEventViewModel>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(detail);
        descriptionService.Build(Arg.Any<RequestDescription>()).ReturnsForAnyArgs("abc");
        matchService.GetMatchEvent(Arg.Any<RequestDescription>()).Returns("A - B");
        mapper.Map<RequestDescription>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(requestDescription);

        // Act
        var actual = manageRequestService.RenderExportExcel(requestModel);

        // Assert
        descriptionService.Received(1).Build(Arg.Compat.Any<RequestDescription>());
        Assert.Equal("abc", actual.Details.FirstOrDefault().Description);
    }
}