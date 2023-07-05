using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest
{
	public class GetGeneralInfoServiceTests
	{
		private readonly RemotingRefWrapperService remotingRefService;
		private readonly IDynamicRepository repository;

		private readonly GetGeneralInfoServiceImp service;

		public GetGeneralInfoServiceTests()
		{
			remotingRefService = Substitute.For<RemotingRefWrapperService>();
			repository = Substitute.For<IDynamicRepository>();

			service = new GetGeneralInfoServiceImp(remotingRefService, repository);
		}

		[Fact]
		public async Task GetGeneralInfoViewModel_HasFullDataReturn_ReturnValidViewModel()
		{
			// Arrange
			var item1 = new List<GeneralInfoModel>
			{
				new GeneralInfoModel
				{
					VoidingHistoryIds = "1",
					NegativeBalanceUsers = "CMMS, HGANB",
					LeagueId = 10,
					HomeId = 12,
					AwayId = 13,
					VoidedTimeString = DateTime.Now.ZoneManila().ToString("dd/MM/yyyy - hh:mm:ss tt"),
					VoidedTime = DateTime.Now,
					KickOffTimeString = DateTime.Now.ToString("hh:mm tt"),
					KickOffTime = DateTime.Now,
					MatchEvent = "Chensi  - vs - Batxa"
				}
			};

			var item2 = new List<UserVoidMessage>
			{
				new UserVoidMessage
				{
					VoidedBy = "aa",
					ContentEnglish = "@@",
					ContentChineseSimplified= "@@"
				}
			};

			var item3 = new List<EmailResultModel>
			{
				new EmailResultModel
				{
					Message = "@@",
					Type = 235
				},
				new EmailResultModel
				{
					Message = "gg",
					Type = 135
				}
			};

			var succeedEmails = new List<string> { { "@@" } };
			var failEmails = new List<string> { { "gg" } };


			var request = new GetGeneralInfoCriteria
			{
				RequestId = 123,
				MatchId = 123
			};
			repository.FetchMultipleAsync<GeneralInfoModel, UserVoidMessage, EmailResultModel>(request)
				.ReturnsForAnyArgs((item1, item2, item3));

			remotingRefService.GetLeagueName(1, "").ReturnsForAnyArgs("Champion League");
			remotingRefService.GetTeamName(12, LanguageCode.English).Returns("Chensi");
			remotingRefService.GetTeamName(13, LanguageCode.English).Returns("Batxa");

			var expected = new GeneralInfoViewModel
			{
				GeneralInfoModel = item1.FirstOrDefault(),
				UserVoidMessages = new List<GroupUserVoidMessage>
				{
					new GroupUserVoidMessage
					{
						Messages = item2,
						VoidedBy = "aa"
					}
				},
				SucceedEmails = succeedEmails,
				FailedEmails = failEmails
			};

			// Act
			var actual = await service.GetGeneralInfoViewModel(request);

			// Assert
			AssertExtension.Equal(expected, actual);
		}
	}
}