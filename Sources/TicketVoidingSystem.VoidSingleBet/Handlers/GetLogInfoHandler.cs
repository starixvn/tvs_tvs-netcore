using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.VoidSingleBet.Criteria;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using TicketVoidingSystem.VoidSingleBet.ViewModels;

namespace TicketVoidingSystem.VoidSingleBet.Handlers;

public class GetLogInfoRequest : GetTicketsQuery, IRequest<ListTicketsViewModel>
{
}

public class GetLogInfoHandler : IRequestHandler<GetLogInfoRequest, ListTicketsViewModel>
{
    private readonly GetTicketsService getTicketsService;

    public GetLogInfoHandler(GetTicketsService getTicketsService)
    {
        this.getTicketsService = getTicketsService;
    }

    public async Task<ListTicketsViewModel> Handle(GetLogInfoRequest request, CancellationToken cancellationToken)
    {
        var model = new ListTicketsViewModel();
        var data = await getTicketsService.GetTickets(request);

        UpdateViewModel(model, data);

        return model;
    }

    private static void UpdateViewModel(ListTicketsViewModel model, ICollection<GetTicketModel> data)
    {
        model.TotalItems = data.Count;
        var singleTickets = data.Where(item => !item.IsMixParlay);
        model.SingleCount = singleTickets.Count();
        var parlayTickets = data.Where(item => item.IsMixParlay);
        model.ParlayCount = parlayTickets.Count();
        UpdateTimeViewModel(model, data);
    }

    private static void UpdateTimeViewModel(ListTicketsViewModel model, ICollection<GetTicketModel> data)
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