using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;

namespace TicketVoidingSystem.Services.JackTimeCashOut;

public interface CashOutApiService
{
    Task VoidBet(CashOutApiModel requestModel);

    Task VoidBet(IEnumerable<TicketEmailModel> tickets);

    Task UndoVoidBet(CashOutApiModel requestModel);
}

public class CashOutApiServiceImp(CashOutHttpClientService cashOutHttpClientService, LoggingService loggingService)
    : CashOutApiService
{
    public async Task VoidBet(CashOutApiModel requestModel)
    {
        const string actionName = "VoidBet";
        await cashOutHttpClientService.PostRequest(actionName, requestModel);
    }

    public async Task VoidBet(IEnumerable<TicketEmailModel> tickets)
    {
        var jackTimeCashOutTickets = tickets.Where(x => x.IsCashOut && JackTimeCashOutExtension.IsHasJackTimeCashOut(x.SportTypeId, x.ExtraInfo));
        if (jackTimeCashOutTickets.Any())
        {
            var requestModel = new CashOutApiModel { VoidBetInfos = jackTimeCashOutTickets.Select(x => new VoidBetInfo { TransId = x.TransId.ToString(), CustId = x.CustId.ToString() }) };
            await VoidBet(requestModel);
        }
    }

    public async Task UndoVoidBet(CashOutApiModel requestModel)
    {
        const string actionName = "UndoVoidBet";
        await cashOutHttpClientService.PostRequest(actionName, requestModel);
    }
}