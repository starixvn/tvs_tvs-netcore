using System.Threading.Tasks;
using MediatR;
using SpecialDelete.Core.DTO;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark;

namespace TicketVoidingSystem.MarkTickets.Handlers.ConfirmAutoUnmark
{
    public class UpdateConfirmAutoUnmarkRequest : UpdateConfirmAutoUnmarkQuery, IRequest<Result>
    {
    }

    public class UpdateConfirmAutoUnmarkHandler : IAsyncRequestHandler<UpdateConfirmAutoUnmarkRequest, Result>
    {
        private readonly AutoUnmarkService autoUnmarkService;

        public UpdateConfirmAutoUnmarkHandler(AutoUnmarkService autoUnmarkService)
        {
            this.autoUnmarkService = autoUnmarkService;
        }

        public async Task<Result> Handle(UpdateConfirmAutoUnmarkRequest message)
        {
            var result = await autoUnmarkService.UpdateConfirmAutoUnmark(message);

            return new Result { ErrorCode = result.ErrorCode, ErrorMsg = result.ErrorMsg };
        }
    }
}