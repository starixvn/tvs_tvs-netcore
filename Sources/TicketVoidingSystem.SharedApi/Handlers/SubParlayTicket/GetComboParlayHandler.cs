using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Services.SubParlayTicket;
using TicketVoidingSystem.SharedApi.ViewModels.SubParlayTicket;

namespace TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;

public class GetComboParlayRequest : QueryComboParlay, IRequest<IList<TicketViewModel>>
{
}

public class GetComboParlayHandler : IRequestHandler<GetComboParlayRequest, IList<TicketViewModel>>
{
    private readonly TicketsService ticketsService;

    public GetComboParlayHandler(TicketsService ticketsService)
    {
        this.ticketsService = ticketsService;
    }

    public async Task<IList<TicketViewModel>> Handle(GetComboParlayRequest message, CancellationToken cancellationToken)
    {
        var tickets = await ticketsService.GetTickets(message.RefNo, cancellationToken);
        var viewModels = new List<TicketViewModel>
        {
            new()
            {
                SubTransId = string.Empty,
                Choice = GetComboAndStake(message, tickets)
            }
        };
        viewModels.AddRange(ticketsService.GetTickets(tickets));
        return viewModels;
    }

    private string GetComboAndStake(QueryComboParlay query, IEnumerable<TicketModel> data)
    {
        var tickets = data.Where(m => m.Stake > 0).ToList();
        var comboName = ticketsService.GetComboName(query);
        var result = new StringBuilder();
        var count = comboName?.Length ?? 0;
        for (var i = 0; i < count; i++)
        {
            var comboNameHtml = $"<span class='combo-name'>{comboName?[i]} x </span>";
            var stake = $"<span class='combo-stake'>{tickets[i].Stake:G29}</span>";
            result.Append($"<div>{comboNameHtml}{stake}</div>");
        }

        return result.ToString();
    }
}