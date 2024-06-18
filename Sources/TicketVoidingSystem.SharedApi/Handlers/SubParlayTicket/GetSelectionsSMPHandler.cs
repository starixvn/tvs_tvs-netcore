using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Resources;
using TicketVoidingSystem.SharedApi.Criteria.SubParlayTicket;
using TicketVoidingSystem.SharedApi.Models.SubParlayTicket;

namespace TicketVoidingSystem.SharedApi.Handlers.SubParlayTicket;

public class GetSelectionsSMPRequest : GetSelectionsSMPCriteria, IRequest<string>
{
}

public class GetSelectionsSMPHandler : IRequestHandler<GetSelectionsSMPRequest, string>
{
    private readonly IDynamicRepository repository;

    public GetSelectionsSMPHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<string> Handle(GetSelectionsSMPRequest message, CancellationToken cancellationToken)
    {
        var result = new StringBuilder();
        var selections = await repository.FetchAsync<SelectionsSMP>(message);
        foreach (var item in selections)
        {
            var selection = item.Result.IsRunningOrEmpty() ?
                string.Format(StringResource.SMP_Selection, item.SelectionName)
                : string.Format(StringResource.SMP_Selection_Result, item.SelectionName, item.Result);
            result.Append(selection);
        }

        return $"<div class=\"smp-group-selections\">{result}</div>";
    }
}