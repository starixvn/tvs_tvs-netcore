using System;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface TicketService
{
    TicketEmailViewModel GetTicket(TicketEmailModel item, Match match, SiteEmail site, bool isFromAfterVoidService);
}

public class TicketServiceImp : TicketService
{
    private readonly BetListCoreService betListCoreService;

    public TicketServiceImp(BetListCoreService betListCoreService)
    {
        this.betListCoreService = betListCoreService;
    }

    public TicketEmailViewModel GetTicket(TicketEmailModel item, Match match, SiteEmail site, bool isFromAfterVoidService)
    {
        var ticket = betListCoreService.BuildTicket(item, match, site, isFromAfterVoidService);
        ticket.BetId = item.TransId.ToString();
        ticket.Member = item.UserName;
        ticket.IsVipMember = item.IsVipMember;
        ticket.OperatorID = item.OperatorID;
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.Currency = item.CurrencyName;
        ticket.Score = item.IsLive && (!item.BetTypeId.HideScore() || item.IsMixParlay)
            ? $"{item.LiveHomeScore} - {item.LiveAwayScore}" : string.Empty;
        ticket.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.Winlost).ToString("#,##0.##");
        ticket.DepositName = item.UserName2;
        ticket.BetFrom = Helper.GetBetFrom(item.BetFrom);
        ticket.Stake = ticket.Stake.Replace("Rebate", "(Rebate)");

        return ticket;
    }
}