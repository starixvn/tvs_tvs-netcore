using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LogInfo;

public class GetVoidTimeByAllowanceSettingServiceTests
{
    private readonly OnlineServerRepository onlineServerRepository = Substitute.For<OnlineServerRepository>();
    public GetVoidTimeByAllowanceSettingService service;

    [Fact]
    public async Task Get_IsDangerAccepted_ReturnExpected()
    {
        // Arrange
        var dateTime = DateTimeOffset.Now.DateTime;
        var query = new GetLogInfoQuery
        {
            MatchId = 0,
            IssueTypeId = IssueTypeConstant.DangerAccepted,
            DangerAcceptedModels = [new DangerAcceptedViewModel { MatchId = 1 }],
        };
        var voidTimeByAllowanceSetting = new List<VoidTimeByAllowanceSetting>
        {
            new()
            {
                MatchId = 1, ScoreId = 0, VoidFromTime = dateTime,
                VoidToTime = dateTime
            },
        };
        var expected = new List<VoidTimeByAllowanceSetting>
        {
            new()
            {
                MatchId = 1, ScoreId = 0, VoidFromTime = dateTime,
                VoidToTime = dateTime
            },
        };

        onlineServerRepository.FetchAsync<VoidTimeByAllowanceSetting>(null).ReturnsForAnyArgs(voidTimeByAllowanceSetting);
        service = new GetVoidTimeByAllowanceSettingServiceImp(onlineServerRepository);

        // Act
        var actual = await service.Get(query);

        // Assert
        await onlineServerRepository.Received().FetchAsync<VoidTimeByAllowanceSetting>(Arg.Is<GetVoidTimeByAllowanceSettingCriteria>(x
            => x.IssueTypeId == IssueTypeConstant.DangerAccepted));
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task Get_IsRedCard_ReturnExpected()
    {
        // Arrange
        var dateTime = DateTimeOffset.Now.DateTime;
        var query = new GetLogInfoQuery
        {
            MatchId = 0,
            IssueTypeId = IssueTypeConstant.RedCard,
            RedCardModels = [new DangerAcceptedViewModel { MatchId = 1 }],
        };
        var voidTimeByAllowanceSetting = new List<VoidTimeByAllowanceSetting>
        {
            new()
            {
                MatchId = 1, ScoreId = 0, VoidFromTime = dateTime,
                VoidToTime = dateTime
            },
        };
        var expected = new List<VoidTimeByAllowanceSetting>
        {
            new()
            {
                MatchId = 1, ScoreId = 0, VoidFromTime = dateTime,
                VoidToTime = dateTime
            },
        };

        onlineServerRepository.FetchAsync<VoidTimeByAllowanceSetting>(null).ReturnsForAnyArgs(voidTimeByAllowanceSetting);
        service = new GetVoidTimeByAllowanceSettingServiceImp(onlineServerRepository);

        // Act
        var actual = await service.Get(query);

        // Assert
        await onlineServerRepository.Received().FetchAsync<VoidTimeByAllowanceSetting>(Arg.Is<GetVoidTimeByAllowanceSettingCriteria>(x
            => x.IssueTypeId == IssueTypeConstant.RedCard));
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task Get_IsWrongScore_ReturnExpected()
    {
        // Arrange
        var dateTime = DateTimeOffset.Now.DateTime;
        var query = new GetLogInfoQuery
        {
            MatchId = 0,
            IssueTypeId = IssueTypeConstant.WrongScore,
            WrongScoreModels = [new WrongScoreInfoViewModel { ScoreId = 1 }],
        };
        var voidTimeByAllowanceSetting = new List<VoidTimeByAllowanceSetting>
        {
            new()
            {
                MatchId = 0, ScoreId = 1, VoidFromTime = dateTime,
                VoidToTime = dateTime
            },
        };
        var expected = new List<VoidTimeByAllowanceSetting>
        {
            new()
            {
                MatchId = 0, ScoreId = 1, VoidFromTime = dateTime,
                VoidToTime = dateTime
            },
        };

        onlineServerRepository.FetchAsync<VoidTimeByAllowanceSetting>(null).ReturnsForAnyArgs(voidTimeByAllowanceSetting);
        service = new GetVoidTimeByAllowanceSettingServiceImp(onlineServerRepository);

        // Act
        var actual = await service.Get(query);

        // Assert
        await onlineServerRepository.Received().FetchAsync<VoidTimeByAllowanceSetting>(Arg.Is<GetVoidTimeByAllowanceSettingCriteria>(x
            => x.IssueTypeId == IssueTypeConstant.WrongScore));
        AssertExtension.Equal(expected, actual);
    }
}