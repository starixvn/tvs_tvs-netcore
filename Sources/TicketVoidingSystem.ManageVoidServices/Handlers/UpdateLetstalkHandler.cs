using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.ManageVoidServices.Services;

namespace TicketVoidingSystem.ManageVoidServices.Handlers
{
    public class UpdateLetstalkRequest : IRequest<bool>
    {
        public string BroadcastSessionId { get; set; }
        public int RequestId { get; set; }
        public int StatusId { get; set; }
    }

    public class UpdateLetstalkHandler : IRequestHandler<UpdateLetstalkRequest, bool>
    {
        private readonly LetstalkService letstalkService;

        public UpdateLetstalkHandler(LetstalkService letstalkService)
        {
            this.letstalkService = letstalkService;
        }

        public async Task<bool> Handle(UpdateLetstalkRequest request, CancellationToken cancellationToken)
        {
            await letstalkService.UpdateLetstalk(request.RequestId, request.BroadcastSessionId, request.StatusId);
            return true;
        }
    }
}