using System;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.Services.SendEmail.Void;

public interface TicketService
{
    TicketEmailViewModel GetTicket(TicketEmailModel item, Match match, bool isFromAfterVoidService);
}

public class TicketServiceImp(BetListCoreService betListCoreService) : TicketService
{
    public TicketEmailViewModel GetTicket(TicketEmailModel item, Match match, bool isFromAfterVoidService)
    {
        var ticket = betListCoreService.BuildTicket(item, match, isFromAfterVoidService);
        ticket.BetId = item.TransId.ToString();
        ticket.Member = item.UserName;
        ticket.IsVipMember = item.IsVipMember;
        ticket.OperatorID = item.OperatorID;
        ticket.TransDate = item.TransDate.ToString(FormatKey.LongDateFormatTimeWithSlash);
        ticket.Score = IsTicketHasScore(item) ? $"{item.LiveHomeScore} - {item.LiveAwayScore}" : string.Empty;
        ticket.WinLoss = item.Status.IsRunningOrWaiting() ? "-" : Convert.ToDecimal(item.Winlost).ToString("#,##0.##");
        ticket.DepositName = item.UserName2;
        ticket.BetFrom = Helper.GetBetFrom(item.BetFrom);
        ticket.Stake = ticket.Stake.Replace("Rebate", "(Rebate)");
        ticket.IsHybrid = item.IsHybrid;
        ticket.SubTransId = item.SubTransId.ToString();

        return ticket;
    }

    private static bool IsTicketHasScore(TicketEmailModel item)
    {
        return item.IsLive && (!item.BetTypeId.HideScore() || item.IsMixParlay) &&
               item.SportTypeId != SportTypeConstant.Baseball;
    }
}