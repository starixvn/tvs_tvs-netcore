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

public class GetComboParlayHandler(TicketsService ticketsService)
    : IRequestHandler<GetComboParlayRequest, IList<TicketViewModel>>
{
    public async Task<IList<TicketViewModel>> Handle(GetComboParlayRequest message, CancellationToken cancellationToken)
    {
        var tickets = await ticketsService.GetTickets(message.RefNo);
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
        if (comboName == null || !comboName.Any())
        {
            return string.Empty;
        }

        var result = new StringBuilder();
        for (var i = 0; i < comboName.Length; i++)
        {
            var comboNameHtml = $"<span class='combo-name'>{comboName[i]}</span>";
            var stake = tickets.ElementAtOrDefault(i) != null
                ? $"<span class='combo-stake'> x {tickets.ElementAtOrDefault(i).Stake:G29}</span>"
                : "";
            result.Append($"<div>{comboNameHtml}{stake}</div>");
        }

        return result.ToString();
    }
}