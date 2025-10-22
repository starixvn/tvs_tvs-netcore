using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Criteria.OnlineServer;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services.OnlineServerRepository;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalBet;

public class CheckValidTransIdsServiceTests
{
    private readonly MapAbnormalBetTicketsExcelService mapTicketsExcelService;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;
    private readonly OnlineServerRepository onlineServerRepository;
    private readonly CheckValidTransIdsServiceImp service;

    public CheckValidTransIdsServiceTests()
    {
        onlineServerRepository = Substitute.For<OnlineServerRepository>();
        matchInfoAddRequestService = Substitute.For<MatchInfoAddRequestService>();
        mapTicketsExcelService = Substitute.For<MapAbnormalBetTicketsExcelService>();

        service = new CheckValidTransIdsServiceImp(onlineServerRepository, matchInfoAddRequestService, mapTicketsExcelService);
    }

    [Fact]
    public void MapValidationAbnormalBet_Should_Return_ModelExpected()
    {
        // Arrange
        var validationAbnormalBets = new List<ValidationAbnormalBet>
        {
            new (){
                InvalidTransIds = "123,456,789,100",
                MovedTransIds = "123,456,789,100",
                ABWhiteListTransIds = "",
                DifferentMatchTransIds = "123",
                SettledTransIds = "100",
                IsHasWarningRemovedTickets = true,
            },
            new (){
                InvalidTransIds = "123,789, 100",
                MovedTransIds = "123,456,789,100",
                ABWhiteListTransIds = "",
                DifferentMatchTransIds = "789,100",
                SettledTransIds = "",
                IsHasWarningRemovedTickets = false,
            },
            new (){
                InvalidTransIds = "456,789",
                MovedTransIds = "123,456,789,100",
                ABWhiteListTransIds = "",
                DifferentMatchTransIds = "789",
                SettledTransIds = "123",
                IsHasWarningRemovedTickets = false,
            }
        };
        var modelExpected = new ValidationAbnormalBet
        {
            InvalidTransIds = "789",
            MovedTransIds = "123,456,789,100",
            ABWhiteListTransIds = "",
            DifferentMatchTransIds = "123,789,100",
            SettledTransIds = "100,123",
            IsHasWarningRemovedTickets = true,
        };

        // Act
        var result = CheckValidTransIdsServiceImp.MapValidationAbnormalBet(validationAbnormalBets);

        // Assert
        Assert.Equal(modelExpected.InvalidTransIds, result.InvalidTransIds);
        Assert.Equal(modelExpected.MovedTransIds, result.MovedTransIds);
        Assert.Equal(modelExpected.ABWhiteListTransIds, result.ABWhiteListTransIds);
        Assert.Equal(modelExpected.DifferentMatchTransIds, result.DifferentMatchTransIds);
        Assert.Equal(modelExpected.SettledTransIds, result.SettledTransIds);
        Assert.Equal(modelExpected.IsHasWarningRemovedTickets, result.IsHasWarningRemovedTickets);
    }

    [Fact]
    public void MapValidationAbnormalBet_EmptyList_Should_Return_EmptyModel()
    {
        // Arrange
        var validationAbnormalBets = new List<ValidationAbnormalBet>();

        // Act
        var result = CheckValidTransIdsServiceImp.MapValidationAbnormalBet(validationAbnormalBets);

        // Assert
        Assert.NotNull(result);
        Assert.Null(result.InvalidTransIds);
        Assert.Null(result.MovedTransIds);
        Assert.Null(result.ABWhiteListTransIds);
        Assert.Null(result.DifferentMatchTransIds);
        Assert.Null(result.SettledTransIds);
        Assert.False(result.IsHasWarningRemovedTickets);
    }

    [Fact]
    public void MapValidationAbnormalBet_SingleItem_Should_Return_SameItem()
    {
        // Arrange
        var validationAbnormalBet = new ValidationAbnormalBet
        {
            InvalidTransIds = "123,456",
            MovedTransIds = "789,100",
            ABWhiteListTransIds = "111,222",
            DifferentMatchTransIds = "333,444",
            SettledTransIds = "555,666",
            IsHasWarningRemovedTickets = true
        };
        var validationAbnormalBets = new List<ValidationAbnormalBet> { validationAbnormalBet };

        // Act
        var result = CheckValidTransIdsServiceImp.MapValidationAbnormalBet(validationAbnormalBets);

        // Assert
        Assert.Equal(validationAbnormalBet.InvalidTransIds, result.InvalidTransIds);
        Assert.Equal(validationAbnormalBet.MovedTransIds, result.MovedTransIds);
        Assert.Equal(validationAbnormalBet.ABWhiteListTransIds, result.ABWhiteListTransIds);
        Assert.Equal(validationAbnormalBet.DifferentMatchTransIds, result.DifferentMatchTransIds);
        Assert.Equal(validationAbnormalBet.SettledTransIds, result.SettledTransIds);
        Assert.Equal(validationAbnormalBet.IsHasWarningRemovedTickets, result.IsHasWarningRemovedTickets);
    }

    [Fact]
    public void MapAbnormalBetTicketRequests_Should_Return_CorrectTickets()
    {
        // Arrange
        var abnormalBetTicketRequests = new List<GetAbnormalBetTicketModel>
        {
            new() { TransId = 123, RemarkId = 0 }, // Valid ticket
            new() { TransId = 456, RemarkId = 0 }, // Valid ticket
            new() { TransId = 789, RemarkId = 1 }, // Valid ticket
            new() { TransId = 100, RemarkId = 2 }, // Other ticket (RemarkId > 1)
            new() { TransId = 200, RemarkId = 3 }, // Other ticket (RemarkId > 1)
            new() { TransId = 123, RemarkId = 0 }  // Duplicate TransId
        };

        // Act
        var result = CheckValidTransIdsServiceImp.MapAbnormalBetTicketRequests(abnormalBetTicketRequests);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(6, resultList.Count); // Should have 5 unique tickets
        Assert.Contains(resultList, x => x.TransId == 123 && x.RemarkId == 0);
        Assert.Contains(resultList, x => x.TransId == 456 && x.RemarkId == 0);
        Assert.Contains(resultList, x => x.TransId == 789 && x.RemarkId == 1);
        Assert.Contains(resultList, x => x.TransId == 100 && x.RemarkId == 2);
        Assert.Contains(resultList, x => x.TransId == 200 && x.RemarkId == 3);
    }

    [Fact]
    public void MapAbnormalBetTicketRequests_EmptyInvalidTransIds_Should_Return_ValidAndOtherTickets()
    {
        // Arrange
        var abnormalBetTicketRequests = new List<GetAbnormalBetTicketModel>
        {
            new() { TransId = 123, RemarkId = 0 }, // Valid ticket
            new() { TransId = 456, RemarkId = 1 }, // Invalid ticket
            new() { TransId = 789, RemarkId = 2 }, // Other ticket
        };

        // Act
        var result = CheckValidTransIdsServiceImp.MapAbnormalBetTicketRequests(abnormalBetTicketRequests);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(3, resultList.Count);
        Assert.Contains(resultList, x => x.TransId == 123 && x.RemarkId == 0);
        Assert.Contains(resultList, x => x.TransId == 789 && x.RemarkId == 2);
    }

    [Fact]
    public void MapSendLetsTalkModels_Should_Group_By_MatchId()
    {
        // Arrange
        var sendLetsTalkModels = new List<SendLetsTalkModel>
        {
            new() { MatchId = 1, IsAllUusTickets = true, ListBetType = "Type1", ListBetTeam = "Team1" },
            new() { MatchId = 1, IsAllUusTickets = false, ListBetType = "Type2", ListBetTeam = "Team2" },
            new() { MatchId = 2, IsAllUusTickets = true, ListBetType = "Type3", ListBetTeam = "Team3" },
            new() { MatchId = 2, IsAllUusTickets = false, ListBetType = "Type4", ListBetTeam = "Team4" },
        };

        // Act
        var result = CheckValidTransIdsServiceImp.MapSendLetsTalkModels(sendLetsTalkModels);

        // Assert
        var resultList = result.ToList();
        Assert.Equal(2, resultList.Count);

        var match1 = resultList.First(x => x.MatchId == 1);
        Assert.Equal(1, match1.MatchId);
        Assert.False(match1.IsAllUusTickets);
        Assert.Equal("Type1,Type2", match1.ListBetType);
        Assert.Equal("Team1,Team2", match1.ListBetTeam);

        var match2 = resultList.First(x => x.MatchId == 2);
        Assert.Equal(2, match2.MatchId);
        Assert.False(match2.IsAllUusTickets);
        Assert.Equal("Type3,Type4", match2.ListBetType);
        Assert.Equal("Team3,Team4", match2.ListBetTeam);
    }

    [Fact]
    public void MapSendLetsTalkModels_EmptyList_Should_Return_EmptyList()
    {
        // Arrange
        var sendLetsTalkModels = new List<SendLetsTalkModel>();

        // Act
        var result = CheckValidTransIdsServiceImp.MapSendLetsTalkModels(sendLetsTalkModels);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void GetTransInfoAddRequestModel_Should_Combine_All_Properties()
    {
        // Arrange
        var transInfoAddRequests = new List<TransInfoAddRequestModel>
        {
            new() { RemoveTransIds = "123,456", UnMarkTransIds = "789", MarkTransIds = "100", TransInfoJson = "json1" },
            new() { RemoveTransIds = "456,789", UnMarkTransIds = "100", MarkTransIds = "200", TransInfoJson = "json2" },
            new() { RemoveTransIds = "789,100", UnMarkTransIds = "200", MarkTransIds = "", TransInfoJson = "json3" }, // Empty MarkTransIds
        };

        // Act
        var result = CheckValidTransIdsServiceImp.GetTransInfoAddRequestModel(transInfoAddRequests);

        // Assert
        Assert.Equal("123,456,789,100", result.RemoveTransIds);
        Assert.Equal("789,100,200", result.UnMarkTransIds);
        Assert.Equal("100,200", result.MarkTransIds);
        Assert.Equal("json1,json2,json3", result.TransInfoJson); // Should only include non-empty MarkTransIds
    }

    [Fact]
    public void GetTransInfoAddRequestModel_EmptyList_Should_Return_EmptyModel()
    {
        // Arrange
        var transInfoAddRequests = new List<TransInfoAddRequestModel>();

        // Act
        var result = CheckValidTransIdsServiceImp.GetTransInfoAddRequestModel(transInfoAddRequests);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("", result.RemoveTransIds);
        Assert.Equal("", result.UnMarkTransIds);
        Assert.Equal("", result.MarkTransIds);
        Assert.Equal("", result.TransInfoJson);
    }

    [Fact]
    public async Task CheckValidTransIds_Should_Return_CompleteViewModel()
    {
        // Arrange
        var request = new CheckValidTransIdsModel
        {
            TransIds = "123,456,789",
            IssueTypeId = 1,
            SubIssueTypeId = 1,
            RequestId = 1,
            ActionId = 1,
            FilterBy = 1,
            IsRemoveCustomerClass201 = false,
            IsRemoveCustomerClass4K = false,
            IsRemoveCreditCashService = false,
            IsAddSettledTickets = false,
            IsVoidAllArchivedTickets = false
        };

        var matchInfoAddRequests = new List<MatchInfoAddRequest> { new() { MatchId = 1 } };
        var validationAbnormalBets = new List<ValidationAbnormalBet> { new() { InvalidTransIds = "123" } };
        var transInfoAddRequests = new List<TransInfoAddRequestModel> { new() { RemoveTransIds = "123" } };
        var abnormalBetTicketRequests = new List<GetAbnormalBetTicketModel> { new() { TransId = 123 } };
        var sendLetsTalkModels = new List<SendLetsTalkModel> { new() { MatchId = 1 } };

        onlineServerRepository.FetchMultipleAsync<MatchInfoAddRequest, ValidationAbnormalBet, TransInfoAddRequestModel, GetAbnormalBetTicketModel, SendLetsTalkModel>(Arg.Any<IOnlineServerCriteria>())
            .Returns(Task.FromResult(((IEnumerable<MatchInfoAddRequest>)matchInfoAddRequests,
                                    (IEnumerable<ValidationAbnormalBet>)validationAbnormalBets,
                                    (IEnumerable<TransInfoAddRequestModel>)transInfoAddRequests,
                                    (IEnumerable<GetAbnormalBetTicketModel>)abnormalBetTicketRequests,
                                    (IEnumerable<SendLetsTalkModel>)sendLetsTalkModels)));

        matchInfoAddRequestService.UpdateDataFromRemotingRef(Arg.Any<IEnumerable<MatchInfoAddRequest>>()).Returns(matchInfoAddRequests);
        mapTicketsExcelService.MapDataToAbnormalBetTicketViewModel(Arg.Any<IEnumerable<GetAbnormalBetTicketModel>>()).Returns(new List<AbnormalBetTicketViewModel>());

        // Act
        var result = await service.CheckValidTransIds(request);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Matches);
        Assert.NotNull(result.Validation);
        Assert.NotNull(result.TransInfoAddRequestModel);
        Assert.NotNull(result.AbnormalBetTicketRequests);
        Assert.NotNull(result.SendLetstalkModels);
    }
}