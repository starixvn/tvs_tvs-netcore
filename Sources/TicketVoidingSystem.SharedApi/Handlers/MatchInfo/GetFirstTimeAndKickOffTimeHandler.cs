using System;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.SharedApi.Criteria.MatchInfo;
using TicketVoidingSystem.SharedApi.Models.MatchInfo;

namespace TicketVoidingSystem.SharedApi.Handlers.MatchInfo;

public class GetFirstTimeAndKickOffTimeRequest : IRequest<FirstTicketTime>
{
    public int MatchId { get; set; }
}

public class GetFirstTimeAndKickOffTimeHandler : IRequestHandler<GetFirstTimeAndKickOffTimeRequest, FirstTicketTime>
{
    private readonly IDynamicRepository repository;

    public GetFirstTimeAndKickOffTimeHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<FirstTicketTime> Handle(GetFirstTimeAndKickOffTimeRequest request, CancellationToken cancellationToken)
    {
        var criteria = new GetFirstTicketTimeCriteria
        {
            MatchId = request.MatchId
        };
        var ticketTime = await repository.GetAsync<FirstTicketTime>(criteria, cancellationToken);
        ticketTime.MinTransDate = GetMinTransDate(ticketTime);
        return new FirstTicketTime
        {
            MinTransDate = ticketTime.MinTransDate.ZoneManila(),
            KickOffTime = ticketTime.KickOffTime.ZoneManila()
        };
    }

    private static DateTime GetMinTransDate(FirstTicketTime ticketTime)
    {
        const int yearPrefix = 2000;
        if (ticketTime.MinTransDate == default)
        {
            ticketTime.MinTransDate = new DateTime(ticketTime.MinTransDate.Year + yearPrefix, ticketTime.MinTransDate.Month, ticketTime.MinTransDate.Day);
        }

        return ticketTime.MinTransDate;
    }
}