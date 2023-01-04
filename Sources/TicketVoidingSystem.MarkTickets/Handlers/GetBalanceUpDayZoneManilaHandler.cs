using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.MarkTickets.Criteria;
using TicketVoidingSystem.MarkTickets.Models;

namespace TicketVoidingSystem.MarkTickets.Handlers
{
    public class GetBalanceUpDayZoneManilaRequest : GetBalanceUpDayCriteria, IRequest<BalanceUp>
    {
    }

    public class GetBalanceUpDayZoneManilaHandler : IRequestHandler<GetBalanceUpDayZoneManilaRequest, BalanceUp>
    {
        private readonly IDynamicRepository repository;

        public GetBalanceUpDayZoneManilaHandler(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<BalanceUp> Handle(GetBalanceUpDayZoneManilaRequest request, CancellationToken cancellationToken)
        {
            var data = await repository.GetAsync<BalanceUp>(request, cancellationToken);

            return new BalanceUp
            {
                BalanceUpDay = data.BalanceUpDay.ZoneManila(),
                MoveBetsDay = data.MoveBetsDay.ZoneManila()
            };
        }
    }
}