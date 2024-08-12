namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class GetLinkedLogShowUiServiceTests
{/*
    private readonly LinkedLogValidationService linkedLogValidationService;
    private readonly GetLinkedLogShowUiServiceImp service;

    public GetLinkedLogShowUiServiceTests()
    {
        linkedLogValidationService = Substitute.For<LinkedLogValidationService>();
        service = new GetLinkedLogShowUiServiceImp(linkedLogValidationService);
    }

    [Theory]
    [InlineData(IssueTypeConstant.WrongHDP, BetTypeConstant.Handicap)]
    [InlineData(IssueTypeConstant.Wrong1stHDP, BetTypeConstant.FirstHalfHandicap)]
    [InlineData(IssueTypeConstant.WrongOU, BetTypeConstant.OverUnder)]
    [InlineData(IssueTypeConstant.Wrong1stOU, BetTypeConstant.FirstHalfOverUnder)]
    public Task GetLinkedLogShowUi_ValidData_ReturnExpected(int issueTypeId, int betType)
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = betType, Hdp1 = 1 } },
            { 2, new LinkedOddsInfo { BetType = 10449, Hdp1 = 1 } },
            { 3, new LinkedOddsInfo { BetType = betType, Hdp1 = 2 } }
        };
        var getLinkedLogModel = new GetLinkedLogModel
        { IssueTypeId = issueTypeId, FilterFromTransTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var poolHouseLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupIdAio,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1H1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            }
        };

        // Act
        var actual = service.GetLinkedLogShowUi(getLinkedLogModel, poolHouseLinkedLogResponses);

        // Assert
        AssertExtension.Equal(2, actual.Count());
        return Task.CompletedTask;
    }

    [Fact]
    public Task GetLinkedLogShowUi_IssueTypeIdIsWrongOdds_ReturnExpected()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = 1, Hdp1 = 1 } },
            { 2, new LinkedOddsInfo { BetType = 1, Hdp1 = 1 } },
            { 3, new LinkedOddsInfo { BetType = 1, Hdp1 = 2 } }
        };
        var getLinkedLogModel = new GetLinkedLogModel
        { IssueTypeId = IssueTypeConstant.WrongOdds, FilterFromTransTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var poolHouseLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupIdAio,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1H1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            }
        };

        linkedLogValidationService
            .IsLinkGroupWrongOdds(Arg.Any<PoolHouseLinkedLogResponse>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(true);
        linkedLogValidationService.IsValidBetTypeWrongOdds(1, Arg.Any<GetLinkedLogModel>()).ReturnsForAnyArgs(true);

        // Act
        var actual = service.GetLinkedLogShowUi(getLinkedLogModel, poolHouseLinkedLogResponses);

        // Assert
        AssertExtension.Equal(3, actual.Count());
        return Task.CompletedTask;
    }

    [Fact]
    public Task GetLinkedLogShowUi_IssueTypeIdIsDangerAccepted_ReturnExpected()
    {
        // Arrange
        var linkedOddsInfoDic = new Dictionary<int, LinkedOddsInfo>
        {
            { 1, new LinkedOddsInfo { BetType = 1, Hdp1 = 1 } },
            { 2, new LinkedOddsInfo { BetType = 1, Hdp1 = 1 } },
            { 3, new LinkedOddsInfo { BetType = 1, Hdp1 = 2 } }
        };
        var getLinkedLogModel = new GetLinkedLogModel
        { IssueTypeId = IssueTypeConstant.DangerAccepted, FilterFromTransTime = new DateTime(2022, 2, 2, 2, 2, 2) };
        var poolHouseLinkedLogResponses = new List<PoolHouseLinkedLogResponse>
        {
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupIdAio,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            },
            new()
            {
                Time = new DateTime(2022, 1, 2, 2, 2, 2),
                LinkGroup = LinkedLogApiConstant.GroupId1H1X2,
                LinkedOddsInfoDic = linkedOddsInfoDic
            }
        };

        linkedLogValidationService
            .IsLinkGroupWrongOdds(Arg.Any<PoolHouseLinkedLogResponse>(), Arg.Any<GetLinkedLogModel>())
            .ReturnsForAnyArgs(true);
        linkedLogValidationService.IsValidBetTypeWrongOdds(1, Arg.Any<GetLinkedLogModel>()).ReturnsForAnyArgs(true);

        // Act
        var actual = service.GetLinkedLogShowUi(getLinkedLogModel, poolHouseLinkedLogResponses);

        // Assert
        AssertExtension.Equal(0, actual.Count());
        return Task.CompletedTask;
    }
    */
}