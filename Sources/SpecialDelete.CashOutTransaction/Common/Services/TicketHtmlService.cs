using SpecialDelete.CashOutTransaction.CancelCashOut.Services;
using SpecialDelete.CashOutTransaction.CancelCashOut.ViewModels;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;

namespace SpecialDelete.CashOutTransaction.Common.Services;

using System;
using Models;
using ViewModels;

public interface TicketHtmlService
{
    VoidTicketHtmlViewModel GetTicket(GetTicketModel item, UserPermission permission);

    TicketHtmlViewModel GetTicket(GetTicketModel item);
}

public class TicketHtmlServiceImp(
    BetListCoreService betListCoreService,
    CheckPermissionService permissionService)
    : TicketHtmlService
{
    public VoidTicketHtmlViewModel GetTicket(GetTicketModel item, UserPermission permission)
    {
        var ticket = new VoidTicketHtmlViewModel
        {
            IsDisable = permissionService.IsDisable(item.Status, item.StatusWinLost, permission)
        };
        MappingFromBetList(ticket, item);
        return ticket;
    }

    public TicketHtmlViewModel GetTicket(GetTicketModel item)
    {
        var ticket = new VoidTicketHtmlViewModel();
        MappingFromBetList(ticket, item);
        return ticket;
    }

    private void MappingFromBetList(VoidTicketHtmlViewModel ticket, GetTicketModel item)
    {
        var betListTicket = betListCoreService.GetTicket(item);
        ticket.Choice = betListTicket.Choice.Contains("AOS") ? betListTicket.Choice + betListTicket.Score : betListTicket.Choice;
        ticket.Handicap = betListTicket.Handicap;
        ticket.Odds = betListTicket.Odds;
        ticket.Score = item.IsLiveIndicator ? $"{item.LiveHomeScore} - {item.LiveAwayScore}" : string.Empty;
        ticket.Stake = betListTicket.Stake;
        ticket.Status = betListTicket.Status;
        ticket.TransDate = item.TransDate.ToString(FormatKey.DateTimeWithMillisecondAndSlash);
        ticket.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.WinLost).ToString("#,##0.##");
    }
}