using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.MarkTickets.Handlers.ConfirmAutoUnmark
{
    public class UpdateConfirmAutoUnmarkRequest : UpdateConfirmAutoUnmarkQuery, IRequest<Result>
    {
    }

    public class UpdateConfirmAutoUnmarkHandler : IRequestHandler<UpdateConfirmAutoUnmarkRequest, Result>
    {
        private readonly UpdateConfirmAutoUnmarkService updateConfirmAutoUnmarkService;

        public UpdateConfirmAutoUnmarkHandler(UpdateConfirmAutoUnmarkService updateConfirmAutoUnmarkService)
        {
            this.updateConfirmAutoUnmarkService = updateConfirmAutoUnmarkService;
        }

        public async Task<Result> Handle(UpdateConfirmAutoUnmarkRequest message, CancellationToken cancellationToken)
        {
            await updateConfirmAutoUnmarkService.InsertAutoUnmarkSetting(message);
            var abnormalBetTickets = await updateConfirmAutoUnmarkService.GetTicketsAbnormalBetByMatchId(message.MatchId);
            var result = await updateConfirmAutoUnmarkService.UpdateConfirmAutoUnmark(message, abnormalBetTickets);

            return new Result { ErrorCode = result.ErrorCode, ErrorMsg = result.ErrorMsg };
        }
    }
}