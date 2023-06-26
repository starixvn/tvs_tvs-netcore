using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest
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

		[Fact]
		public async void GetData_WhenIsFromDateBeforeBUDayFalse_HasCallGetRequestsInActiveTable()
		{
			// Arrange
			var requestModel = new List<RequestModel>();
			var _ = new List<string>();
			var query = new SelectRequestsQuery { RequestId = null, IsFromDateBeforeBUDay = false };
			getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>()).ReturnsForAnyArgs((requestModel, _));
			mapper.Map<GetActiveRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>()).Returns(new GetActiveRequestInfoCriteria());
			// Act
			var actual = await service.GetRequests(query);

			// Assert
			await getRequestsInActiveTableService.Received().GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>());
			Assert.NotNull(actual.Item1);
			Assert.NotNull(actual.Item2);
		}

		[Fact]
		public async void GetData_WhenIsToDateBeforeBUDayTrue_ReturnEmpty()
		{
			// Arrange
			var requestModel = new List<RequestModel>();
			var _ = new List<string>();
			var query = new SelectRequestsQuery { RequestId = null, IsFromDateBeforeBUDay = true, IsToDateBeforeBUDay = true };
			getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>()).ReturnsForAnyArgs((requestModel, _));
			mapper.Map<GetArchivedRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>()).Returns(new GetArchivedRequestInfoCriteria());
			repository.FetchAsync<GetRequestInfoModel>(Arg.Any<GetArchivedRequestInfoCriteria>()).Returns(new List<GetRequestInfoModel>());
			// Act
			var actual = await service.GetRequests(query);

			// Assert
			Assert.Empty(actual.Item1);
		}

		[Fact]
		public async void GetData_WhenIsToDateBeforeBUDayTrue_ReturnListRequestModel()
		{
			// Arrange
			var requestModel = new List<RequestModel>
			{
				new()
				{
					RequestId = 1
					},
					new()
				{
					RequestId = 2
				}
			};
			var requestArchivedModel = new List<RequestModel>
			{
				new()
				{
					RequestId = 1
					},
					new()
				{
					RequestId = 2
				}
			};
			var _ = new List<string>();
			var query = new SelectRequestsQuery { RequestId = null, IsFromDateBeforeBUDay = true, IsToDateBeforeBUDay = true };

			getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>()).ReturnsForAnyArgs((requestModel, _));
			getRequestsInArchivedTableService.GetRequestsInArchivedTable(Arg.Any<SelectRequestsQuery>()).ReturnsForAnyArgs((requestArchivedModel, _));

			mapper.Map<GetArchivedRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>()).Returns(new GetArchivedRequestInfoCriteria());
			repository.FetchAsync<GetRequestInfoModel>(Arg.Any<GetArchivedRequestInfoCriteria>()).Returns(new List<GetRequestInfoModel>
			{
				new GetRequestInfoModel() { RequestId = 1, IsActiveRequest = true },
				new GetRequestInfoModel() { RequestId = 2, IsActiveRequest = false }
			});

			// Act
			var actual = await service.GetRequests(query);

			// Assert
			Assert.Equal(4, actual.Item1.Count());
		}

		[Fact]
		public async void GetData_WhenIsAnotherInput_ReturnListRequestModel()
		{
			// Arrange
			var requestModel = new List<RequestModel>
			{
				new()
				{
					RequestId = 1
					},
			};
			var requestArchivedModel = new List<RequestModel>
			{
				new()
				{
					RequestId = 1
					},
			};
			var _ = new List<string>();
			var query = new SelectRequestsQuery { RequestId = null, IsFromDateBeforeBUDay = true, IsToDateBeforeBUDay = false };

			getRequestsInActiveTableService.GetRequestsInActiveTable(Arg.Any<SelectRequestsQuery>()).ReturnsForAnyArgs((requestModel, _));
			getRequestsInArchivedTableService.GetRequestsInArchivedTable(Arg.Any<SelectRequestsQuery>()).ReturnsForAnyArgs((requestArchivedModel, _));

			mapper.Map<GetArchivedRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>()).Returns(new GetArchivedRequestInfoCriteria());
			mapper.Map<GetActiveRequestInfoCriteria>(Arg.Any<SelectRequestsQuery>()).Returns(new GetActiveRequestInfoCriteria());
			repository.FetchAsync<GetRequestInfoModel>(Arg.Any<GetArchivedRequestInfoCriteria>()).Returns(new List<GetRequestInfoModel>
			{
				new GetRequestInfoModel() { RequestId = 1, IsActiveRequest = true },
				new GetRequestInfoModel() { RequestId = 2, IsActiveRequest = false }
			});

			repository.FetchAsync<GetRequestInfoModel>(Arg.Any<GetActiveRequestInfoCriteria>()).Returns(new List<GetRequestInfoModel>
			{
				new GetRequestInfoModel() { RequestId = 1, IsActiveRequest = true },
				new GetRequestInfoModel() { RequestId = 2, IsActiveRequest = false }
			});

			// Act
			var actual = await service.GetRequests(query);

			// Assert
			Assert.Equal(2, actual.Item1.Count());
		}
	}
}