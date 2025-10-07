using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Services.OnlineServerRepository;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;

public interface CheckValidTransIdsService
{
    Task<CheckValidTransIdsViewModel> CheckValidTransIds(CheckValidTransIdsModel request);
}

public class CheckValidTransIdsServiceImp(
    OnlineServerRepository onlineServerRepository,
    MatchInfoAddRequestService matchInfoAddRequestService,
    MapAbnormalBetTicketsExcelService mapTicketsExcelService)
    : CheckValidTransIdsService
{
    public async Task<CheckValidTransIdsViewModel> CheckValidTransIds(CheckValidTransIdsModel request)
    {
        var (matchInfoAddRequests, validationAbnormalBets, transInfoAddRequests, abnormalBetTicketRequests, sendLetsTalkModels)
            = await CheckValidTransIdsAllSite(request);

        var ticketRequests = MapAbnormalBetTicketRequests(abnormalBetTicketRequests);
        var viewModel = new CheckValidTransIdsViewModel
        {
            Matches = matchInfoAddRequestService.UpdateDataFromRemotingRef(matchInfoAddRequests),
            Validation = MapValidationAbnormalBet(validationAbnormalBets),
            TransInfoAddRequestModel = GetTransInfoAddRequestModel(transInfoAddRequests),
            AbnormalBetTicketRequests = mapTicketsExcelService.MapDataToAbnormalBetTicketViewModel(ticketRequests),
            SendLetstalkModels = MapSendLetsTalkModels(sendLetsTalkModels),
            InfoSiteDBDownModel = InfoSiteDbDownHelper.Get(transInfoAddRequests)
        };

        return viewModel;
    }

    private static bool IsInvalidTicket(GetAbnormalBetTicketModel ticket, IEnumerable<GetAbnormalBetTicketModel> validTickets, IEnumerable<GetAbnormalBetTicketModel> otherTickets)
    {
        return validTickets.All(x => x.TransId != ticket.TransId) && otherTickets.All(x => x.TransId != ticket.TransId);
    }

    public static List<GetAbnormalBetTicketModel> MapAbnormalBetTicketRequests(IEnumerable<GetAbnormalBetTicketModel> abnormalBetTicketRequests)
    {
        var result = new List<GetAbnormalBetTicketModel>();
        var validTickets = abnormalBetTicketRequests.Where(x => x.RemarkId == 0);
        var otherTickets = abnormalBetTicketRequests.Where(x => x.RemarkId > RemarkConstant.InvalidTicketId);
        var isInvalidTickets = abnormalBetTicketRequests.Where(x => IsInvalidTicket(x, validTickets, otherTickets)).DistinctBy(x => x.TransId);

        result.AddRange(validTickets);
        result.AddRange(otherTickets);
        result.AddRange(isInvalidTickets);

        return result;
    }

    private async Task<(IEnumerable<MatchInfoAddRequest>, IEnumerable<ValidationAbnormalBet>, IEnumerable<TransInfoAddRequestModel>,
            IEnumerable<GetAbnormalBetTicketModel>, IEnumerable<SendLetsTalkModel>)> CheckValidTransIdsAllSite(CheckValidTransIdsModel request)
    {
        var criteria = await GetCheckValidTransIdsCriteria(request);

        var (matchInfoAddRequests, validationAbnormalBets, transInfoAddRequests, abnormalBetTicketRequests, sendLetsTalkModels) =
            await onlineServerRepository.FetchMultipleAsync<MatchInfoAddRequest, ValidationAbnormalBet,
                TransInfoAddRequestModel, GetAbnormalBetTicketModel, SendLetsTalkModel>(criteria);

        var distinctMatchInfoAddRequests = matchInfoAddRequests.DistinctBy(x => x.MatchId);

        return (distinctMatchInfoAddRequests, validationAbnormalBets, transInfoAddRequests, abnormalBetTicketRequests, sendLetsTalkModels);
    }

    public static List<SendLetsTalkModel> MapSendLetsTalkModels(IEnumerable<SendLetsTalkModel> sendLetsTalkModels)
    {
        var groups = sendLetsTalkModels.GroupBy(x => x.MatchId);
        var result = new List<SendLetsTalkModel>();
        foreach (var group in groups)
        {
            var sendLetsTalkModel = new SendLetsTalkModel
            {
                MatchId = group.Key,
                IsAllUusTickets = group.All(x => x.IsAllUusTickets),
                ListBetType = Helper.GetUnionTransIdString(group.Select(x => x.ListBetType)),
                ListBetTeam = Helper.GetUnionTransIdString(group.Select(x => x.ListBetTeam))
            };
            result.Add(sendLetsTalkModel);
        }
        return result;
    }

    public static TransInfoAddRequestModel GetTransInfoAddRequestModel(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests)
    {
        return new TransInfoAddRequestModel
        {
            RemoveTransIds = Helper.GetUnionTransIdString(transInfoAddRequests.Select(x => x.RemoveTransIds)),
            UnMarkTransIds = Helper.GetUnionTransIdString(transInfoAddRequests.Select(x => x.UnMarkTransIds)),
            MarkTransIds = Helper.GetUnionTransIdString(transInfoAddRequests.Select(x => x.MarkTransIds)),
            TransInfoJson = string.Join(",", transInfoAddRequests.Where(x => !string.IsNullOrEmpty(x.TransInfoJson)).Select(x => x.TransInfoJson))
        };
    }

    public static ValidationAbnormalBet MapValidationAbnormalBet(IEnumerable<ValidationAbnormalBet> validationAbnormalBets)
    {
        if (!validationAbnormalBets.Any())
        {
            return new ValidationAbnormalBet();
        }

        var result = new ValidationAbnormalBet
        {
            InvalidTransIds = Helper.GetIntersectTransIdString(validationAbnormalBets.Select(x => x.InvalidTransIds)),
            MovedTransIds = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.MovedTransIds)),
            DifferentMatchTransIds = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.DifferentMatchTransIds)),
            SettledTransIds = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.SettledTransIds)),
            UnsupportedTransIds = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.UnsupportedTransIds)),
            ExistingReqTransIds = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.ExistingReqTransIds)),
            TransIdsOfVIPCustomer = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.TransIdsOfVIPCustomer)),
            TransIdsOfCustomerClass201 = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.TransIdsOfCustomerClass201)),
            TransIdsOfCustomerClass4K = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.TransIdsOfCustomerClass4K)),
            TransIdsOfCreditCashService = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.TransIdsOfCreditCashService)),
            NonLiveTransIds = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.NonLiveTransIds)),
            DifferentLiveScoreTransIds = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.DifferentLiveScoreTransIds)),
            ABWhiteListTransIds = Helper.GetUnionTransIdString(validationAbnormalBets.Select(x => x.ABWhiteListTransIds)),
            IsHasWarningRemovedTickets = validationAbnormalBets.Any(x => x.IsHasWarningRemovedTickets),
            TransIdsOfSiteDBDown = validationAbnormalBets.FirstOrDefault(x => x.TransIdsOfSiteDBDown != null)?.TransIdsOfSiteDBDown
        };

        return result;
    }

    private async Task<CheckValidTransIdsCriteria> GetCheckValidTransIdsCriteria(CheckValidTransIdsModel message)
    {
        var currentOnlineServerId = await onlineServerRepository.GetOnlineServerIds();

        var criteria = new CheckValidTransIdsCriteria
        {
            TransIds = message.TransIds,
            RequestId = message.RequestId,
            ActionId = message.ActionId,
            FilterBy = message.FilterBy,
            SubIssueTypeId = message.SubIssueTypeId,
            IsRemoveCustomerClass201 = message.IsRemoveCustomerClass201,
            IsRemoveCustomerClass4K = message.IsRemoveCustomerClass4K,
            isRemoveCreditCashService = message.IsRemoveCreditCashService,
            IsAddSettledTickets = message.IsAddSettledTickets,
            IsVoidAllArchivedTickets = message.IsVoidAllArchivedTickets,
            OnlineServerId = currentOnlineServerId
        };

        return criteria;
    }
}