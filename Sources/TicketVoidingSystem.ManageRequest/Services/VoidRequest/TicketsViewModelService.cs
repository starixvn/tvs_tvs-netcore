using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Extension;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Services.VoidRequest;

public interface TicketsViewModelService
{
    void UpdateViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> allTickets, int issueTypeId,
        VoidPermission voidPermission);
}

public class TicketsViewModelServiceImp : TicketsViewModelService
{
    public void UpdateViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> allTickets, int issueTypeId,
        VoidPermission voidPermission)
    {
        var ticketsByGroup = GetTicketsByGroup(allTickets);
        var validTickets = GetValidTickets(ticketsByGroup, voidPermission, issueTypeId);
        var voidTickets = validTickets.SingleTickets.Union(validTickets.ParlayTickets)
            .Union(validTickets.CricketTickets);

        UpdateValidTickets(model, validTickets);
        UpdateUncheckTickets(model, allTickets);
        UpdateLicenseeName(model, allTickets);
        UpdateBetTypes(model, allTickets);
        UpdateTimeViewModel(model, allTickets);
        UpdateCheckPermissionTickets(model, allTickets);
        UpdateTotalCounts(model, allTickets, ticketsByGroup);
        UpdateVariableForTemplateMessage(model, voidTickets);
        model.GroupPHAffected = GetGroupPhAffected(allTickets);
    }

    private static short GetGroupPhAffected(IEnumerable<GetTicketModel> data)
    {
        var isHasTicketPh1X2Affected = data.Any(x => x.GroupPHAffected == 1);
        var isHasTicketPhAioAffected = data.Any(x => x.GroupPHAffected == 2);
        if (isHasTicketPh1X2Affected && isHasTicketPhAioAffected) return GroupPHAffectedConstant.Group1X2AndAIO;

        if (isHasTicketPh1X2Affected) return GroupPHAffectedConstant.Group1X2;

        if (isHasTicketPhAioAffected) return GroupPHAffectedConstant.GroupAIO;
        return 0;
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

    private static TicketsByGroupInRequest GetTicketsByGroup(IEnumerable<GetTicketModel> allTickets)
    {
        return new TicketsByGroupInRequest
        {
            SingleTickets = allTickets.Where(item => !item.IsMixParlay && !item.IsCricket && !item.IsCancelCashOut),
            ParlayTickets = allTickets.Where(item => item.IsMixParlay && !item.IsCricket && !item.IsCancelCashOut),
            CricketTickets = allTickets.Where(item => item.IsCricket),
            CancelCashOutTickets = allTickets.Where(item => item.IsCancelCashOut)
        };
    }

    private static TicketsByGroupInRequest GetValidTickets(TicketsByGroupInRequest ticketsInRequest,
        VoidPermission permission, int issueTypeId)
    {
        var enableSingle = ticketsInRequest.SingleTickets.Where(x => !x.IsDisable(permission, issueTypeId));
        var disableBonusSingle =
            ticketsInRequest.SingleTickets.Where(x => x.IsDisable(permission, issueTypeId) && x.WalletType > 0);
        var validVoidSingleTickets = enableSingle.Concat(disableBonusSingle);

        var validVoidParlayTickets = ticketsInRequest.ParlayTickets.Where(x => !x.IsDisable(permission, issueTypeId));

        var enableCricket = ticketsInRequest.CricketTickets.Where(x => !x.IsDisable(permission, issueTypeId));
        var disableBonusCricket =
            ticketsInRequest.CricketTickets.Where(x => x.IsDisable(permission, issueTypeId) && x.WalletType > 0);
        var validVoidCricketTickets = enableCricket.Concat(disableBonusCricket);

        var validCancelCashOutTickets =
            ticketsInRequest.CancelCashOutTickets.Where(x => !x.IsDisable(permission, issueTypeId));

        return new TicketsByGroupInRequest
        {
            SingleTickets = validVoidSingleTickets,
            ParlayTickets = validVoidParlayTickets,
            CricketTickets = validVoidCricketTickets,
            CancelCashOutTickets = validCancelCashOutTickets
        };
    }

    private static void UpdateLicenseeName(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        var instantLicensee = data.Where(item => item.IsInstantSettlement && item.IsDeposit)
            .Select(item => item.LicenseeName).Distinct().ToArray();
        var cashOutLicensee = data.Where(item => item.IsCashOut && item.IsDeposit).Select(item => item.LicenseeName)
            .Distinct().ToArray();
        var cancelCashOutLicensee = data.Where(item => item.IsCancelCashOut && item.IsDeposit)
            .Select(item => item.LicenseeName).Distinct().ToArray();
        var chinaViewLicensee =
            data.Where(item => item.IsChinaView).Select(item => item.LicenseeName).Distinct().ToArray();
        var jollyViewLicensee = data.Where(item => item.SpecialPlatform == SpecialPlatformConstant.JollySports)
            .Select(item => item.LicenseeName).Distinct().ToArray();
        var licensees = data.Where(item =>
                item.IsDeposit && !chinaViewLicensee.Contains(item.LicenseeName) &&
                !jollyViewLicensee.Contains(item.LicenseeName))
            .Select(item => item.LicenseeName).Distinct().ToArray();
        Array.Sort(licensees, StringComparer.InvariantCulture);
        Array.Sort(instantLicensee, StringComparer.InvariantCulture);
        Array.Sort(cashOutLicensee, StringComparer.InvariantCulture);
        Array.Sort(cancelCashOutLicensee, StringComparer.InvariantCulture);
        Array.Sort(chinaViewLicensee, StringComparer.InvariantCulture);
        model.LicenseesName = string.Join(", ", licensees);
        model.InstantLicenseesName = string.Join(", ", instantLicensee);
        model.CashOutLicenseesName = string.Join(", ", cashOutLicensee);
        model.CancelCashOutLicenseesName = string.Join(", ", cancelCashOutLicensee);
        model.ChinaViewLicenseesName = string.Join(", ", chinaViewLicensee);
        model.JollyViewLicenseesName = string.Join(", ", jollyViewLicensee);
    }

    private static void UpdateUncheckTickets(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        var specialGroup = data.Where(item => item.GroupName.IsUncheck()).ToList();
        model.UncheckedTransIds = specialGroup
            .Select(item => item.IsMixParlay ? item.SubTransId.ToString() : item.TransId.ToString()).ToList();
    }

    private static void UpdateBetTypes(TicketsViewModel model, IEnumerable<GetTicketModel> allTickets)
    {
        var betTypes = allTickets.Select(ticket => ticket.IsMixParlay ? ticket.SubBetType : ticket.BetType).Distinct();
        model.BetTypes = string.Join(",", betTypes);
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