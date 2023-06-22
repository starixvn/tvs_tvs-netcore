using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest
{
    public class RenderRequestServiceTests
    {
        private readonly DescriptionService descriptionService;
        private readonly IMapper mapper;
        private readonly RemotingRefWrapperService remotingRefWrapperService;
        private readonly RenderRequestServiceImp manageRequestService;

        public RenderRequestServiceTests()
        {
            descriptionService = Substitute.For<DescriptionService>();

            mapper = Substitute.For<IMapper>();

            remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
            manageRequestService = new RenderRequestServiceImp(mapper, descriptionService, remotingRefWrapperService);
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
            remotingRefWrapperService.GetTeamName(default, default).ReturnsForAnyArgs("aa");
            remotingRefWrapperService.GetLeagueName(default, default).ReturnsForAnyArgs("bb");
            mapper.Map<RequestEventViewModel>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(detail);
            descriptionService.Build(Arg.Any<RequestDescription>()).ReturnsForAnyArgs("abc");
            mapper.Map<RequestViewModel>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(requestViewModel);
            mapper.Map<RequestDescription>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(requestDescription);

            // Act
            var actual = manageRequestService.Render(groupRequestModel);

            // Assert
            descriptionService.Received(1).Build(Arg.Compat.Any<RequestDescription>());
        }

        [Fact]
        public void RenderExportExcel_HasViewModel_ReturnValidViewModel()
        {
            // Arrange
            var requestModel = new RequestModel{ CreatedDate = DateTime.Now };
            var viewModel = new RequestViewModel();
            mapper.Map<RequestViewModel>(Arg.Any<RequestModel >()).ReturnsForAnyArgs(viewModel);
            var requestDescription = new RequestDescription();
            var detail = new RequestEventViewModel();
            remotingRefWrapperService.GetTeamName(default, default).ReturnsForAnyArgs("aa");
            remotingRefWrapperService.GetLeagueName(default, default).ReturnsForAnyArgs("bb");
            mapper.Map<RequestEventViewModel>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(detail);
            descriptionService.Build(Arg.Any<RequestDescription>()).ReturnsForAnyArgs("abc");
            mapper.Map<RequestDescription>(Arg.Any<RequestModel>()).ReturnsForAnyArgs(requestDescription);

            // Act
            var actual = manageRequestService.RenderExportExcel(requestModel);

            // Assert
            descriptionService.Received(1).Build(Arg.Compat.Any<RequestDescription>());
            Assert.Equal("abc", actual.Details.FirstOrDefault().Description);
        }
    }
}