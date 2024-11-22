using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface TicketsViewModelService
{
    void UpdateViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> allTickets, int issueTypeId, VoidPermission voidPermission);
}

public class TicketsViewModelServiceImp : TicketsViewModelService
{
    private readonly GetTicketsViewModelService getTicketsViewModelService;
    private readonly GetInfoTicketsForMessage getInfoTicketsForMessage;

    public TicketsViewModelServiceImp(GetTicketsViewModelService getTicketsViewModelService, GetInfoTicketsForMessage getInfoTicketsForMessage)
    {
        this.getTicketsViewModelService = getTicketsViewModelService;
        this.getInfoTicketsForMessage = getInfoTicketsForMessage;
    }

    public void UpdateViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> allTickets, int issueTypeId,
        VoidPermission voidPermission)
    {
        var ticketsByGroup = getTicketsViewModelService.GetTicketsByGroup(allTickets);
        var validTickets = getTicketsViewModelService.GetValidTickets(ticketsByGroup, voidPermission, issueTypeId);
        var voidTickets = validTickets.SingleTickets.Union(validTickets.ParlayTickets)
            .Union(validTickets.CricketTickets);

        UpdateValidTickets(model, validTickets);
        UpdateUncheckTickets(model, allTickets);
        model.LicenseeAffectedList = GetLicenseeAffectedList(allTickets);
        UpdateBetTypeIdsAndSpecialBetType(model, allTickets);
        UpdateTimeViewModel(model, allTickets);
        UpdateCheckPermissionTickets(model, allTickets);
        UpdateTotalCounts(model, allTickets, ticketsByGroup);
        UpdateVariableForTemplateMessage(model, voidTickets);
        model.GroupPHAffected = getTicketsViewModelService.GetGroupPhAffected(allTickets);
    }

    private static void UpdateValidTickets(TicketsViewModel model, TicketsByGroupInRequest validTickets)
    {
        model.SingleTickets = validTickets.SingleTickets.Select(ConvertGetTicketModelToBetId).ToList();
        model.ParlayTickets = validTickets.ParlayTickets.Select(ConvertGetTicketModelToBetId).ToList();
        model.CricketTickets = validTickets.CricketTickets.Select(ConvertGetTicketModelToBetId).ToList();
        model.CancelCashOutTickets = validTickets.CancelCashOutTickets.Select(ConvertGetTicketModelToBetId).ToList();
    }

    private static void UpdateTotalCounts(TicketsViewModel model, IEnumerable<GetTicketModel> allTickets,
        TicketsByGroupInRequest ticketsByGroup)
    {
        model.Total = allTickets.Count();
        model.TotalSingle = ticketsByGroup.SingleTickets.Union(ticketsByGroup.CricketTickets).Count();
        model.TotalParlay = ticketsByGroup.ParlayTickets.Count();
        model.TotalCancelCashOut = ticketsByGroup.CancelCashOutTickets.Count();
    }

    private static void UpdateVariableForTemplateMessage(TicketsViewModel model,
        IEnumerable<GetTicketModel> voidTickets)
    {
        model.IsHasSettledTicket = voidTickets.Any(x => x.IsSettledTicket());
        model.IsAllLiveTickets = voidTickets.All(x => x.IsLiveIndicator);
        model.IsAllNonLiveTickets = voidTickets.All(x => !x.IsLiveIndicator);
    }

    private static void UpdateCheckPermissionTickets(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        model.CheckPermissionTickets =
            data.Where(item => !item.IsCancelCashOut).Select(ConvertGetTicketModelToBetId).ToList();
        model.AllCancelCashOutTickets =
            data.Where(item => item.IsCancelCashOut).Select(ConvertGetTicketModelToBetId).ToList();
    }

    private static BetId ConvertGetTicketModelToBetId(GetTicketModel model)
    {
        return new BetId
        {
            TransId = model.IsMixParlay ? model.SubTransId.ToString() : model.TransId.ToString(),
            SiteDbGroupId = model.SiteDbGroupId,
            MatchId = model.MatchId
        };
    }

    private static List<AffectedLicensee> GetLicenseeAffectedList(IEnumerable<GetTicketModel> data)
    {
        var instantLicensee = data.Where(item => item.IsInstantSettlement && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var timeMachineLicensee = data.Where(item => Convert.ToInt32(item.BetType).IsSabaTimeMachine() && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var cashOutLicensee = data.Where(item => item.IsCashOut && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var cancelCashOutLicensee = data.Where(item => item.IsCancelCashOut && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var chinaViewLicensee = data.Where(item => item.IsChinaView).Select(item => item.LicenseeName).Distinct().ToArray();
        var jollyViewLicensee = data.Where(item => item.SpecialPlatform == SpecialPlatformConstant.JollySports).Select(item => item.LicenseeName).Distinct().ToArray();
        var jollySportsCvLicensee = data.Where(item => item.SpecialPlatform == SpecialPlatformConstant.JollySportsCv).Select(item => item.LicenseeName).Distinct().ToArray();
        var licensees = data.Where(item => item.IsDeposit && !chinaViewLicensee.Contains(item.LicenseeName) &&
                                           !jollyViewLicensee.Contains(item.LicenseeName) && !jollySportsCvLicensee.Contains(item.LicenseeName))
            .Select(item => item.LicenseeName).Distinct().ToArray();

        Array.Sort(licensees, StringComparer.InvariantCulture);
        Array.Sort(instantLicensee, StringComparer.InvariantCulture);
        Array.Sort(timeMachineLicensee, StringComparer.InvariantCulture);
        Array.Sort(cashOutLicensee, StringComparer.InvariantCulture);
        Array.Sort(cancelCashOutLicensee, StringComparer.InvariantCulture);
        Array.Sort(chinaViewLicensee, StringComparer.InvariantCulture);
        Array.Sort(jollyViewLicensee, StringComparer.InvariantCulture);
        Array.Sort(jollySportsCvLicensee, StringComparer.InvariantCulture);

        var licenseeAffectedList = new AffectedLicenseeList();
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.Normal].LicenseesName = string.Join(", ", licensees);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.Instant].LicenseesName = string.Join(", ", instantLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.CashOut].LicenseesName = string.Join(", ", cashOutLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.ChinaView].LicenseesName = string.Join(", ", chinaViewLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.JollyView].LicenseesName = string.Join(", ", jollyViewLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.JollySportCv].LicenseesName = string.Join(", ", jollySportsCvLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.CancelCashOut].LicenseesName = string.Join(", ", cancelCashOutLicensee);
        licenseeAffectedList.LicenseeAffectedList[IndexGroupLicenseeAffectedConstant.TimeMachine].LicenseesName = string.Join(", ", timeMachineLicensee);

        return licenseeAffectedList.LicenseeAffectedList;
    }

    private static void UpdateUncheckTickets(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        var specialGroup = data.Where(item => item.GroupName.IsUncheck()).ToList();
        model.UncheckedTransIds = specialGroup
            .Select(item => item.IsMixParlay ? item.SubTransId.ToString() : item.TransId.ToString()).ToList();
    }

    private void UpdateBetTypeIdsAndSpecialBetType(TicketsViewModel model, IEnumerable<GetTicketModel> allTickets)
    {
        var betTypeIds = allTickets.Select(ticket => ticket.IsMixParlay ? ticket.SubBetType : ticket.BetType).Distinct().ToList();
        model.BetTypes = string.Join(",", betTypeIds);

        if (betTypeIds.Count == 1)
        {
            var betTypeId = betTypeIds.First();
            model.BetTypeNameReplaceMessage = getInfoTicketsForMessage.GetSpecialBetTypeContent(allTickets);
            model.BetTeam = getInfoTicketsForMessage.GetSpecialBetTeam(betTypeId, allTickets);
            model.HdpValues = getInfoTicketsForMessage.GetHdpValues(betTypeId, allTickets);
        }
        else
        {
            model.BetTypeNameReplaceMessage = new ContentByLanguageModel();
        }
    }

    private static void UpdateTimeViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        var voidTickets = data.Where(item => !item.IsCancelCashOut);
        var cancelCashOutTickets = data.Where(item => item.IsCancelCashOut);
        if (voidTickets.Any())
        {
            model.FromTime = voidTickets.Select(item => item.TransDate)
                .Union(cancelCashOutTickets.Select(item => item.CheckTimeCancelCashOut)).Min().ZoneManila();
            model.FromDate = voidTickets.Min(item => item.WinLostDate).ZoneManila();
            model.ToDate = voidTickets.Select(item => item.WinLostDate)
                .Union(cancelCashOutTickets.Select(item => item.CheckTimeCancelCashOut)).Max().ZoneManila();
            model.ToTime = voidTickets.Select(item => item.TransDate)
                .Union(cancelCashOutTickets.Select(item => item.CheckTimeCancelCashOut)).Max().ZoneManila();
        }
        else
        {
            if (cancelCashOutTickets.Any())
            {
                model.FromDate = cancelCashOutTickets.Min(item => item.CheckTimeCancelCashOut).ZoneManila();
                model.ToDate = cancelCashOutTickets.Max(item => item.CheckTimeCancelCashOut).ZoneManila();
                model.FromTime = cancelCashOutTickets.Min(item => item.CheckTimeCancelCashOut).ZoneManila();
                model.ToTime = cancelCashOutTickets.Max(item => item.CheckTimeCancelCashOut).ZoneManila();
            }
        }
    }
}