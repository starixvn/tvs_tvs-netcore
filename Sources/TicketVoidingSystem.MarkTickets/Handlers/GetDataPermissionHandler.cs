using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.MarkTickets.Handlers
{
    using Fanex.NAP.Core.Business;
    using MediatR;
    using Models;

    public class GetDataPermissionRequest : IRequest<DataPermission>
    {
    }

    public class GetDataPermissionHandler : IRequestHandler<GetDataPermissionRequest, DataPermission>
    {
        private readonly ISessionService session;

        public GetDataPermissionHandler(ISessionService session)
        {
            this.session = session;
        }

        public DataPermission Handle(GetDataPermissionRequest message)
        {
            return new DataPermission
            {
                IsReadMarkTickets = session.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Read),
                IsHostMarkTickets = session.HasPermission(SpecialDeleteFunctionKeys.MarkTickets, Constant.Policy.Host)
            };
        }
    }
}