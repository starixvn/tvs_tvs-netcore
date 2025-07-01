using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;

public interface CheckValidTransIdsService
{
    Task<CheckValidTransIdsViewModel> CheckValidTransIds(CheckValidTransIdsModel request);
}

public class CheckValidTransIdsServiceImp(
    IDynamicRepository repository,
    MatchInfoAddRequestService matchInfoAddRequestService,
    MapAbnormalBetTicketsExcelService mapTicketsExcelService,
    CheckServerStatusService checkServerStatusService,
    GetInfoSiteDbDownService getTicketsSiteDbDown)
    : CheckValidTransIdsService
{
    public async Task<CheckValidTransIdsViewModel> CheckValidTransIds(CheckValidTransIdsModel request)
    {
        var onlineServer = await checkServerStatusService.GetOnlineServer();
        var currentOnlineServerId = string.Join(",", onlineServer.Select(x => x.Id));

        var criteria = GetCheckValidTransIdsCriteria(request, currentOnlineServerId);

        var tasks = onlineServer.Select(server =>
        {
            criteria.SiteDbGroupId = server.Id;
            return repository.FetchMultipleAsync<MatchInfoAddRequest, ValidationAbnormalBet, TransInfoAddRequestModel, GetAbnormalBetTicketModel, SendLetsTalkModel>(criteria);
        });
        var results = await Task.WhenAll(tasks);

        var matchInfoAddRequests = results.SelectMany(x => x.Item1).DistinctBy(x => x.MatchId);
        var validationAbnormalBets = results.SelectMany(x => x.Item2);
        var transInfoAddRequests = results.SelectMany(x => x.Item3);
        var abnormalBetTicketRequests = results.SelectMany(x => x.Item4).Distinct();
        var sendLetsTalkModels = results.SelectMany(x => x.Item5);

        var viewModel = new CheckValidTransIdsViewModel
        {
            Matches = matchInfoAddRequestService.UpdateDataFromRemotingRef(matchInfoAddRequests),
            Validation = MapValidationAbnormalBet(validationAbnormalBets),
            TransInfoAddRequestModel = GetTransInfoAddRequestModel(transInfoAddRequests),
            AbnormalBetTicketRequests = mapTicketsExcelService.MapDataToAbnormalBetTicketViewModel(abnormalBetTicketRequests),
            SendLetstalkModels = MapSendLetsTalkModels(sendLetsTalkModels),
            InfoSiteDBDownModel = getTicketsSiteDbDown.GetInfoSiteDBDown(transInfoAddRequests)
        };

        return viewModel;
    }

    protected virtual IEnumerable<SendLetsTalkModel> MapSendLetsTalkModels(IEnumerable<SendLetsTalkModel> sendLetsTalkModels)
    {
        var groups = sendLetsTalkModels.GroupBy(x => x.MatchId);
        var result = new List<SendLetsTalkModel>();
        foreach (var group in groups)
        {
            var sendLetsTalkModel = new SendLetsTalkModel
            {
                MatchId = group.Key,
                IsHasUusTickets = group.Any(x => x.IsHasUusTickets),
                ListBetType = Helper.GetUnionTransIdString(group.Select(x => x.ListBetType)),
                ListBetTeam = Helper.GetUnionTransIdString(group.Select(x => x.ListBetTeam))
            };
            result.Add(sendLetsTalkModel);
        }
        return result;
    }

    protected virtual TransInfoAddRequestModel GetTransInfoAddRequestModel(IEnumerable<TransInfoAddRequestModel> transInfoAddRequests)
    {
        return new TransInfoAddRequestModel
        {
            RemoveTransIds = Helper.GetUnionTransIdString(transInfoAddRequests.Select(x => x.RemoveTransIds)),
            UnMarkTransIds = Helper.GetUnionTransIdString(transInfoAddRequests.Select(x => x.UnMarkTransIds)),
            MarkTransIds = Helper.GetUnionTransIdString(transInfoAddRequests.Select(x => x.MarkTransIds)),
            TransInfoJson = string.Join(",", transInfoAddRequests.Where(x => !string.IsNullOrEmpty(x.MarkTransIds)).Select(x => x.TransInfoJson))
        };
    }

    protected virtual ValidationAbnormalBet MapValidationAbnormalBet(IEnumerable<ValidationAbnormalBet> validationAbnormalBets)
    {
        if (!validationAbnormalBets.Any())
            return new ValidationAbnormalBet();

        var result = new ValidationAbnormalBet
        {
            InvalidTransIds = Helper.GetIntersectTransIdString(validationAbnormalBets.Select(x => x.InvalidTransIds)),
            MovedTransIds = Helper.GetIntersectTransIdString(validationAbnormalBets.Select(x => x.MovedTransIds)),
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
            ABWhiteListTransIds = Helper.GetIntersectTransIdString(validationAbnormalBets.Select(x => x.ABWhiteListTransIds)),
            IsHasWarningRemovedTickets = validationAbnormalBets.Any(x => x.IsHasWarningRemovedTickets),
            TransIdsOfSiteDBDown = validationAbnormalBets.FirstOrDefault(x => x.TransIdsOfSiteDBDown != null)?.TransIdsOfSiteDBDown
        };

        return result;
    }

    private static CheckValidTransIdsCriteria GetCheckValidTransIdsCriteria(CheckValidTransIdsModel message, string onlineServerId)
    {
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
            OnlineServerId = onlineServerId
        };

        return criteria;
    }
}