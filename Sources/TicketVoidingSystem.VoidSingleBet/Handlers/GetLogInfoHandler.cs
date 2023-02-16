using MediatR;
using TicketVoidingSystem.VoidSingleBet.Criteria;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class GetLogInfoRequest : GetTicketsQuery, IRequest<TicketsViewModel>
{
}

public class GetLogInfoHandler : IAsyncRequestHandler<GetLogInfoRequest, TicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;

    public GetLogInfoHandler(
        GetTicketsService getTicketsService)
    {
        this.getTicketsService = getTicketsService;
    }

    public async Task<TicketsViewModel> Handle(GetLogInfoRequest message)
    {
        var model = new TicketsViewModel();
        var data = await getTicketsService.GetTickets(message);

        UpdateViewModel(model, data);

        return model;
    }

    private static void UpdateViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        model.TotalItems = data.Count();
        var singleTickets = data.Where(item => !item.IsMixParlay).ToList();
        model.SingleCount = singleTickets.Count;
        var parlayTickets = data.Where(item => item.IsMixParlay).ToList();
        model.ParlayCount = parlayTickets.Count;
        UpdateTimeViewModel(model, data);
    }

    private static void UpdateTimeViewModel(TicketsViewModel model, IEnumerable<GetTicketModel> data)
    {
        if (!data.Any())
        {
            return;
        }
        model.FromTransTime = data.Min(item => item.TransDate).ZoneManila();
        model.FromCheckTime = data.Min(item => item.CheckTime).ZoneManila();
        model.ToTransTime = data.Max(item => item.TransDate).ZoneManila();
        model.ToCheckTime = data.Max(item => item.CheckTime).ZoneManila();
    }
}