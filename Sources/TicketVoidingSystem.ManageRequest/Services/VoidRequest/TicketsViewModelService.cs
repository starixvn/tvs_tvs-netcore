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
    private readonly GetTicketsService getTicketsService;

    public TicketsViewModelServiceImp(GetTicketsService getTicketsService)
    {
        this.getTicketsService = getTicketsService;
    }

    public void UpdateViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> allTickets, int issueTypeId, VoidPermission voidPermission)
    {
        var ticketsInRequest = GetTicketsInRequest(allTickets);
        var validTickets = GetValidTickets(ticketsInRequest.SingleTickets, ticketsInRequest.ParlayTickets,
            ticketsInRequest.CricketTickets, ticketsInRequest.CancelCashOutTickets, voidPermission, issueTypeId);
        var voidTickets = validTickets.ValidVoidSingleTickets.Union(validTickets.ValidVoidParlayTickets)
            .Union(validTickets.ValidVoidCricketTickets);

        model.SingleTickets = validTickets.ValidVoidSingleTickets.Select(ConvertGetTicketModelToBetId).ToList();
        model.ParlayTickets = validTickets.ValidVoidParlayTickets.Select(ConvertGetTicketModelToBetId).ToList();
        model.CricketTickets = validTickets.ValidVoidCricketTickets.Select(ConvertGetTicketModelToBetId).ToList();
        model.CancelCashOutTickets = validTickets.ValidCancelCashOutTickets.Select(ConvertGetTicketModelToBetId).ToList();

        UpdateUncheckTickets(model, allTickets);
        UpdateLicenseeName(model, allTickets);
        UpdateBetTypes(model, allTickets);
        UpdateTimeViewModel(model, allTickets);
        UpdateCheckPermissionTickets(model, allTickets);

        model.Total = allTickets.Count();
        model.TotalSingle = ticketsInRequest.SingleTickets.Union(ticketsInRequest.CricketTickets).Count();
        model.TotalParlay = ticketsInRequest.ParlayTickets.Count();
        model.TotalCancelCashOut = ticketsInRequest.CancelCashOutTickets.Count();

        model.IsAllLiveTickets = voidTickets.All(x => x.IsLiveIndicator);
        model.IsHasAioMessage = voidTickets.Any(x => IsValidTicketHaveAioMessage(issueTypeId, x));
    }

    private static void UpdateCheckPermissionTickets(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        model.CheckPermissionTickets = data.Where(item => !item.IsCancelCashOut).Select(item => new BetId
        {
            TransId = item.IsMixParlay ? item.SubTransId.ToString() : item.TransId.ToString(),
            SiteDbGroupId = item.SiteDbGroupId,
            MatchId = item.MatchId
        }).ToList();

        model.AllCancelCashOutTickets = data.Where(item => item.IsCancelCashOut).Select(item => new BetId
        {
            TransId = item.TransId.ToString(),
            SiteDbGroupId = item.SiteDbGroupId,
            MatchId = item.MatchId
        }).ToList();
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

    private static (IEnumerable<GetTicketModel> SingleTickets, IEnumerable<GetTicketModel> ParlayTickets,
        IEnumerable<GetTicketModel> CricketTickets, IEnumerable<GetTicketModel> CancelCashOutTickets)
        GetTicketsInRequest(IEnumerable<GetTicketModel> data)
    {
        var singleTickets = data.Where(item => !item.IsMixParlay && !item.IsCricket && !item.IsCancelCashOut);
        var parlayTickets = data.Where(item => item.IsMixParlay && !item.IsCricket && !item.IsCancelCashOut);
        var cricketTickets = data.Where(item => item.IsCricket);
        var cancelCashOutTickets = data.Where(item => item.IsCancelCashOut);

        return (singleTickets, parlayTickets, cricketTickets, cancelCashOutTickets);
    }

    private static (IEnumerable<GetTicketModel> ValidVoidSingleTickets, IEnumerable<GetTicketModel> ValidVoidParlayTickets,
        IEnumerable<GetTicketModel> ValidVoidCricketTickets, IEnumerable<GetTicketModel> ValidCancelCashOutTickets)
        GetValidTickets(IEnumerable<GetTicketModel> singleTickets, IEnumerable<GetTicketModel> parlayTickets,
            IEnumerable<GetTicketModel> cricketTickets, IEnumerable<GetTicketModel> cancelCashOutTickets, VoidPermission permission, int issueTypeId)
    {
        var enableSingle = singleTickets.Where(x => !x.IsDisable(permission, issueTypeId));
        var disableBonusSingle = singleTickets.Where(x => x.IsDisable(permission, issueTypeId) && x.WalletType > 0);
        var validVoidSingleTickets = enableSingle.Concat(disableBonusSingle);

        var validVoidParlayTickets = parlayTickets.Where(x => !x.IsDisable(permission, issueTypeId));

        var enableCricket = cricketTickets.Where(x => !x.IsDisable(permission, issueTypeId));
        var disableBonusCricket = cricketTickets.Where(x => x.IsDisable(permission, issueTypeId) && x.WalletType > 0);
        var validVoidCricketTickets = enableCricket.Concat(disableBonusCricket);

        var validCancelCashOutTickets = cancelCashOutTickets.Where(x => !x.IsDisable(permission, issueTypeId));

        return (validVoidSingleTickets, validVoidParlayTickets, validVoidCricketTickets, validCancelCashOutTickets);
    }

    private static void UpdateLicenseeName(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        var instantLicensee = data.Where(item => item.IsInstantSettlement && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var cashOutLicensee = data.Where(item => item.IsCashOut && item.IsDeposit).Select(item => item.LicenseeName).Distinct().ToArray();
        var chinaViewLicensee = data.Where(item => item.IsChinaview).Select(item => item.LicenseeName).Distinct().ToArray();
        var licensees = data.Where(item => item.IsDeposit && !chinaViewLicensee.Contains(item.LicenseeName)).Select(item => item.LicenseeName).Distinct().ToArray();
        Array.Sort(licensees, StringComparer.InvariantCulture);
        Array.Sort(instantLicensee, StringComparer.InvariantCulture);
        Array.Sort(cashOutLicensee, StringComparer.InvariantCulture);
        Array.Sort(chinaViewLicensee, StringComparer.InvariantCulture);
        model.LicenseesName = string.Join(", ", licensees);
        model.InstantLicenseesName = string.Join(", ", instantLicensee);
        model.CashOutLicenseesName = string.Join(", ", cashOutLicensee);
        model.ChinaViewLicenseesName = string.Join(", ", chinaViewLicensee);
    }

    private static void UpdateUncheckTickets(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        var specialGroup = data.Where(item => item.GroupName.IsUncheck()).ToList();
        model.UncheckedTransIds = specialGroup.Select(item => item.IsMixParlay ? item.SubTransId.ToString() : item.TransId.ToString()).ToList();
    }

    private static void UpdateBetTypes(TicketsViewModel model, IEnumerable<GetTicketModel> allTickets)
    {
        var betTypes = allTickets.Select(ticket => ticket.IsMixParlay ? ticket.SubBetType : ticket.BetType).Distinct();
        model.BetTypes = string.Join(",", betTypes);
    }

    private static void UpdateTimeViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        if (data.Any())
        {
            model.FromTime = data.Min(item => item.TransDate).ZoneManila();
            model.FromDate = data.Min(item => item.WinLostDate).ZoneManila();
            model.ToTime = data.Max(item => item.TransDate).ZoneManila();
            model.ToDate = data.Max(item => item.WinLostDate).ZoneManila();
        }
    }

    private static bool IsValidTicketHaveAioMessage(int issueTypeId, GetTicketModel ticket)
    {
        return CheckAioMessageWrongHdp(issueTypeId, ticket) || CheckAioMessageWrong1stHdp(issueTypeId, ticket);
    }

    private static bool CheckAioMessageWrongHdp(int issueTypeId, GetTicketModel ticket)
    {
        return issueTypeId == IssueTypeConstant.WrongHDP
               && (ticket.IsMixParlay ? ticket.SubBetType != BetTypeConstant.Handicap : ticket.BetType != BetTypeConstant.Handicap);
    }

    private static bool CheckAioMessageWrong1stHdp(int issueTypeId, GetTicketModel ticket)
    {
        return issueTypeId == IssueTypeConstant.Wrong1stHDP
               && (ticket.IsMixParlay ? ticket.SubBetType != BetTypeConstant.FirstHalfHandicap : ticket.BetType != BetTypeConstant.FirstHalfHandicap);
    }
}