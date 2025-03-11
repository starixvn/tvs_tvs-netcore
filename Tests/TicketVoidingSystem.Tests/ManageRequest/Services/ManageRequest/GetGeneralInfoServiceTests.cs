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

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

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
            new()
            {
                VoidingHistoryIds = "1",
                NegativeBalanceUsers = "CM, HAN",
                LeagueId = 10,
                HomeId = 12,
                AwayId = 13,
                VoidedTimeString = DateTime.Now.ZoneManila().ToString("dd/MM/yyyy - hh:mm:ss tt"),
                VoidedTime = DateTime.Now,
                KickOffTimeString = DateTime.Now.ToString("hh:mm tt"),
                KickOffTime = DateTime.Now
            }
        };

        var item2 = new List<UserVoidMessage>
        {
            new()
            {
                VoidedBy = "aa",
                ContentEnglish = "@@",
                ContentChineseSimplified = "@@"
            }
        };

        var item3 = new List<EmailResultModel>
        {
            new()
            {
                Message = "@@",
                Type = 235
            },
            new()
            {
                Message = "gg",
                Type = 135
            }
        };

        var succeedEmails = new List<string> { "@@" };
        var failEmails = new List<string> { "gg" };

        var request = new GetGeneralInfoCriteria
        {
            RequestId = 123
        };
        repository.FetchMultipleAsync<GeneralInfoModel, UserVoidMessage, EmailResultModel>(request)
            .ReturnsForAnyArgs((item1, item2, item3));

        remotingRefService.GetLeagueName(1, 1, "").ReturnsForAnyArgs("Champion League");
        remotingRefService.GetTeamName(1, 12, LanguageCode.English).Returns("Chen");
        remotingRefService.GetTeamName(1, 13, LanguageCode.English).Returns("Bat");

        var expected = new GeneralInfoViewModel
        {
            GeneralInfoModel = item1.FirstOrDefault(),
            UserVoidMessages = new List<GroupUserVoidMessage>
            {
                new()
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

    [Fact]
    public async Task GetGeneralInfoViewModel_NoHasGeneralInfo_ReturnValidViewModel()
    {
        // Arrange
        var item1 = new List<GeneralInfoModel>();
        var item2 = new List<UserVoidMessage>
        {
            new()
            {
                VoidedBy = "aa",
                ContentEnglish = "@@",
                ContentChineseSimplified = "@@"
            }
        };
        var item3 = new List<EmailResultModel>
        {
            new()
            {
                Message = "@@",
                Type = 235
            },
            new()
            {
                Message = "gg",
                Type = 135
            }
        };
        var succeedEmails = new List<string> { "@@" };
        var failEmails = new List<string> { "gg" };
        var request = new GetGeneralInfoCriteria
        {
            RequestId = 123
        };
        repository.FetchMultipleAsync<GeneralInfoModel, UserVoidMessage, EmailResultModel>(request)
            .ReturnsForAnyArgs((item1, item2, item3));

        remotingRefService.GetLeagueName(1, 1, "").ReturnsForAnyArgs("Champion League");
        remotingRefService.GetTeamName(1, 12, LanguageCode.English).Returns("Chen");
        remotingRefService.GetTeamName(1, 13, LanguageCode.English).Returns("Bat");

        var expected = new GeneralInfoViewModel
        {
            GeneralInfoModel = new GeneralInfoModel
            {
                VoidedTimeString = new DateTime().ZoneManila().ToString("dd/MM/yyyy - hh:mm:ss tt"),
                RecoveredTimeString = "01/01/0001 12:00:00 AM",
                KickOffTimeString = new DateTime().ZoneManila().ToString("hh:mm tt"),
                LeagueName = "Champion League"
            },
            UserVoidMessages = new List<GroupUserVoidMessage>
            {
                new()
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