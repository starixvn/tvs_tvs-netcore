using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using Xunit;
using AutoMapper;

namespace TicketVoidingSystem.Facts.ManageRequest.Services.ManageRequest
{
    public class GetRequestsServiceTests
    {
        private readonly IMapper mapper;
        private readonly IDynamicRepository repository;
        private readonly GetRequestsInActiveTableService getRequestsInActiveTableService;
        private readonly GetRequestsInArchivedTableService getRequestsInArchivedTableService;
        private readonly GetRequestsServiceImp service;

        public GetRequestsServiceTests()
        {
            mapper = Substitute.For<IMapper>();
            repository = Substitute.For<IDynamicRepository>();
            getRequestsInActiveTableService = Substitute.For<GetRequestsInActiveTableService>();
            getRequestsInArchivedTableService = Substitute.For<GetRequestsInArchivedTableService>();

            service = new GetRequestsServiceImp(mapper, repository, getRequestsInActiveTableService, getRequestsInArchivedTableService);
        }

        [Fact]
        public void GetData_WhenRequestIdValid_HasCallGetRequestsInActiveTable()
        {
            // Arrange
            var requestModel = new List<RequestModel>();
            var _ = new List<string>();
            var query = new SelectRequestsQuery { RequestId = "123" };
            getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>()).ReturnsForAnyArgs((requestModel, _));

            // Act
            var actual = service.GetRequests(query);

            // Assert
            getRequestsInActiveTableService.Received().GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>());
        }

        [Fact]
        public void GetData_WhenMatchIdValid_HasCallGetRequestsInActiveTable()
        {
            // Arrange
            var requestModel = new List<RequestModel>();
            var _ = new List<string>();
            var query = new SelectRequestsQuery { RequestId = null, MatchId = 1 };
            getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>()).ReturnsForAnyArgs((requestModel, _));

            // Act
            var actual = service.GetRequests(query);

            // Assert
            getRequestsInActiveTableService.Received().GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>());
        }

        // [Fact]
        // public void GetData_HasRequestIdAndGetDataArchiveTableHasCalled_ReturnRequestModel()
        // {
        //     // Arrange
        //     var models = new List<RequestModel>();
        //     var repository = Substitute.For<IDynamicRepository>();
        //     var betListService = Substitute.For<BetListService>();
        //     repository.FetchMultiple<RequestModel, GetRequestInfoModel, string>(Arg.Any<SelectActivedRequestsCriteria>())
        //         .ReturnsForAnyArgs((models, new List<GetRequestInfoModel>(), new List<string> { "" }));
        //     var requestModel = new SelectRequestsQuery { RequestId = "1" };
        //     var requestXmlModel = models.Select(x => new RequestXMLModel
        //         { RequestId = x.RequestId, TransIds = x.TransIds });
        //     var manageRequestService = new GetRequestsServiceImp(repository, betListService);

        //     // Act
        //     var (actual, _) = manageRequestService.GetRequests(requestModel);

        //     // Assert
        //     repository.Received(1).FetchMultiple<RequestModel, GetRequestInfoModel, string>(Arg.Any<SelectActivedRequestsCriteria>());
        //     Assert.AreEqual(0, actual.Count());
        // }

        // [Fact]
        // public void GetData_HasMatchIdAndFromDateAfterBUDay_ReturnResultActiveTable()
        // {
        //     // Arrange
        //     var requestModel = new SelectRequestsQuery
        //     {
        //         MatchId = 1000091,
        //         IsFromDateBeforeBUDay = false,
        //     };
        //     var models = new List<RequestModel>();
        //     var repository = Substitute.For<IDynamicRepository>();
        //     var betListService = Substitute.For<BetListService>();
        //     repository.FetchMultiple<RequestModel, GetRequestInfoModel, string>(Arg.Any<SelectActivedRequestsCriteria>())
        //         .ReturnsForAnyArgs((models, new List<GetRequestInfoModel>(), new List<string> { "" }));
        //     var requestXmlModel = models.Select(x => new RequestXMLModel
        //         { RequestId = x.RequestId, TransIds = x.TransIds });
        //     var manageRequestService = new GetRequestsServiceImp(repository, betListService);

        //     // Act
        //     var (actual, _) = manageRequestService.GetRequests(requestModel);

        //     // Assert
        //     repository.Received(1)
        //         .FetchMultiple<RequestModel, GetRequestInfoModel, string>(Arg.Is<SelectActivedRequestsCriteria>(x => x.MatchId == 1000091));
        //     Assert.AreEqual(0, actual.Count());
        // }

        // [Fact]
        // public void GetData_GetRequestInfoInArchivedTableReturnData_ReturnResultArchiveTable()
        // {
        //     // Arrange
        //     var requestModel = new SelectRequestsQuery
        //     {
        //         IssueTypeId = "1",
        //         IsFromDateBeforeBUDay = true,
        //         IsToDateBeforeBUDay = true,
        //     };
        //     var archivedRequestDetail = new List<GetRequestInfoModel>
        //     {
        //         new GetRequestInfoModel { RequestId = 1, IsActivedRequest = false },
        //         new GetRequestInfoModel { RequestId = 2, IsActivedRequest = true },
        //         new GetRequestInfoModel { RequestId = 3, IsActivedRequest = false }
        //     };
        //     var archivedRequests = new List<RequestModel>
        //     {
        //         new RequestModel { IssueTypeId = 11, TransIds = "1", RequestId = 12345 },
        //         new RequestModel { IssueTypeId = 1, TransIds = "2", RequestId = 12346 },
        //         new RequestModel { IssueTypeId = 15, TransIds = "2", RequestId = 12347 },
        //         new RequestModel { IssueTypeId = 11, TransIds = "2", RequestId = 12348 }
        //     };

        //     var activedRequests = new List<RequestModel>
        //     {
        //         new RequestModel { TransIds = "1", RequestId = 12345 },
        //         new RequestModel { TransIds = "2", RequestId = 12346 },
        //         new RequestModel { IssueTypeId = 15, TransIds = "2", RequestId = 12341 },
        //         new RequestModel { IssueTypeId = 11, TransIds = "2", RequestId = 12342 }
        //     };

        //     var repository = Substitute.For<IDynamicRepository>();
        //     var betListService = Substitute.For<BetListService>();
        //     repository.FetchMultiple<RequestModel, string>(Arg.Any<SelectArchivedRequestsCriteria>())
        //         .ReturnsForAnyArgs((activedRequests, new List<string> { "" }));
        //     repository.FetchMultiple<RequestModel, GetRequestInfoModel, string>(Arg.Any<SelectActivedRequestsCriteria>())
        //         .ReturnsForAnyArgs((activedRequests, new List<GetRequestInfoModel>(), new List<string> { "" }));
        //     repository.Fetch<GetRequestInfoModel>(Arg.Any<GetArchivedRequestInfoCriteria>())
        //         .ReturnsForAnyArgs(archivedRequestDetail);
        //     var manageRequestService = new GetRequestsServiceImp(repository, betListService);

        //     // Act
        //     var (actual, _) = manageRequestService.GetRequests(requestModel);

        //     // Assert
        //     repository.FetchMultiple<RequestModel, GetRequestInfoModel, string>(Arg.Any<SelectArchivedRequestsCriteria>());
        //     Assert.AreEqual(8, actual.Count());
        // }

        // [Fact]
        // public void GetData_GetRequestInfoInArchivedTableReturnNoData_ReturnNoData()
        // {
        //     // Arrange
        //     var requestModel = new SelectRequestsQuery
        //     {
        //         IssueTypeId = "1",
        //         IsFromDateBeforeBUDay = true,
        //         IsToDateBeforeBUDay = true,
        //     };

        //     var repository = Substitute.For<IDynamicRepository>();
        //     var manageRequestService = new GetRequestsServiceImp(repository, null);

        //     // Act
        //     var (actual, _) = manageRequestService.GetRequests(requestModel);

        //     // Assert
        //     repository.Received(1).Fetch<GetRequestInfoModel>(Arg.Any<GetArchivedRequestInfoCriteria>());
        //     Assert.AreEqual(0, actual.Count());
        // }

        // [Fact]
        // public void GetData_HasNotMatchIdAndRequestId_ReturnResultOfBothTable()
        // {
        //     // Arrange
        //     var requestModel = new SelectRequestsQuery
        //     {
        //         IsFromDateBeforeBUDay = true,
        //         IsToDateBeforeBUDay = false,
        //     };
        //     var requestDetail = new List<GetRequestInfoModel>
        //     {
        //         new GetRequestInfoModel { RequestId = 1, IsActivedRequest = false },
        //         new GetRequestInfoModel { RequestId = 2, IsActivedRequest = true },
        //         new GetRequestInfoModel { RequestId = 3, IsActivedRequest = false }
        //     };

        //     var requests = new List<RequestModel>
        //     {
        //         new RequestModel { TransIds = "1", RequestId = 12345 },
        //         new RequestModel { TransIds = "2", RequestId = 12346 }
        //     };

        //     var repository = Substitute.For<IDynamicRepository>();
        //     var betListService = Substitute.For<BetListService>();

        //     repository.Fetch<GetRequestInfoModel>(Arg.Any<GetActivedRequestInfoCriteria>())
        //         .ReturnsForAnyArgs(requestDetail);
        //     repository.Fetch<GetRequestInfoModel>(Arg.Any<GetArchivedRequestInfoCriteria>())
        //         .ReturnsForAnyArgs(requestDetail);
        //     repository.FetchMultiple<RequestModel, string>(Arg.Any<SelectArchivedRequestsCriteria>())
        //         .ReturnsForAnyArgs((requests, new List<string> { "" }));
        //     repository.FetchMultiple<RequestModel, GetRequestInfoModel, string>(Arg.Any<SelectActivedRequestsCriteria>())
        //         .ReturnsForAnyArgs((requests, new List<GetRequestInfoModel>(), new List<string>{""}));

        //     var manageRequestService = new GetRequestsServiceImp(repository, betListService);

        //     // Act
        //     var (actual,_) = manageRequestService.GetRequests(requestModel);

        //     // Assert
        //     repository.Received(1).Fetch<GetRequestInfoModel>(Arg.Any<GetActivedRequestInfoCriteria>());
        //     repository.Received(1).Fetch<GetRequestInfoModel>(Arg.Any<GetActivedRequestInfoCriteria>());
        //     repository.Received(2).FetchMultiple<RequestModel, GetRequestInfoModel, string>(Arg.Any<SelectActivedRequestsCriteria>());
        //     Assert.AreEqual(2, actual.Count());
        // }

        // [Fact]
        // public void GetData_FromDateBeforeBUDay_ReturnActiveData()
        // {
        //     // Arrange
        //     var requestModel = new SelectRequestsQuery
        //     {
        //         IsFromDateBeforeBUDay = false,
        //         IsToDateBeforeBUDay = false,
        //     };
        //     var requestDetail = new List<GetRequestInfoModel>
        //     {
        //         new GetRequestInfoModel { RequestId = 1, IsActivedRequest = false },
        //         new GetRequestInfoModel { RequestId = 2, IsActivedRequest = true },
        //         new GetRequestInfoModel { RequestId = 3, IsActivedRequest = false }
        //     };

        //     var requests = new List<RequestModel>
        //     {
        //         new RequestModel { TransIds = "1", RequestId = 12345 },
        //         new RequestModel { TransIds = "2", RequestId = 12346 }
        //     };

        //     var repository = Substitute.For<IDynamicRepository>();
        //     var betListService = Substitute.For<BetListService>();
        //     repository.Fetch<GetRequestInfoModel>(Arg.Any<GetActivedRequestInfoCriteria>())
        //         .ReturnsForAnyArgs(requestDetail);
        //     repository.FetchMultiple<RequestModel, GetRequestInfoModel, string>(Arg.Any<SelectArchivedRequestsCriteria>())
        //         .ReturnsForAnyArgs((requests, new List<GetRequestInfoModel>(), null));

        //     var manageRequestService = new GetRequestsServiceImp(repository, betListService);

        //     // Act
        //     var (actual,_) = manageRequestService.GetRequests(requestModel);

        //     // Assert
        //     repository.Received(1).Fetch<GetRequestInfoModel>(Arg.Any<GetActivedRequestInfoCriteria>());
        //     repository.Received(1).Fetch<GetRequestInfoModel>(Arg.Any<GetActivedRequestInfoCriteria>());
        //     Assert.AreEqual(2, actual.Count());
        // }
    }
}