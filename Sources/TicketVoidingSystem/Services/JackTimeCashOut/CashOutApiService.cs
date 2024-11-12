using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.JackTimeCashOut;

public interface CashOutApiService
{
    Task VoidBet(CashOutApiModel requestModel);

    Task UndoVoidBet(CashOutApiModel requestModel);

    Task VoidBetForCashOutBasketball(IEnumerable<TicketEmailModel> tickets);
}

public class CashOutApiServiceImp(CashOutHttpClientService cashOutHttpClientService, LoggingService loggingService)
    : CashOutApiService
{
    public async Task VoidBet(CashOutApiModel requestModel)
    {
        const string actionName = "VoidBet";
        await cashOutHttpClientService.PostRequest(actionName, requestModel);
    }

    public async Task UndoVoidBet(CashOutApiModel requestModel)
    {
        const string actionName = "UndoVoidBet";
        await cashOutHttpClientService.PostRequest(actionName, requestModel);
    }

    public async Task VoidBetForCashOutBasketball(IEnumerable<TicketEmailModel> tickets)
    {
        try
        {
            var basketballCashOutTickets = tickets.Where(x => x.IsCashOut && x.SportTypeId == SportTypeConstant.Basketball);
            if (basketballCashOutTickets.Any())
            {
                var requestModel = new CashOutApiModel { VoidBetInfos = basketballCashOutTickets.Select(x => new VoidBetInfo { TransId = x.TransId.ToString(), CustId = x.CustId.ToString() }) };
                await VoidBet(requestModel);
            }
        }
        catch (Exception exception)
        {
            await loggingService.ErrorAsync("VoidBetForCashOutBasketball", exception);
        }
    }
}