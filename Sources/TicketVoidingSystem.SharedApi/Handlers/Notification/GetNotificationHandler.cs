using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Criteria.Notification;
using TicketVoidingSystem.SharedApi.Models.Notification;

namespace TicketVoidingSystem.SharedApi.Handlers.Notification;

public class GetNotificationRequest : IRequest<IEnumerable<NotificationModel>>;

public class GetNotificationHandler(IDynamicRepository repository, SessionService sessionService)
    : IRequestHandler<GetNotificationRequest, IEnumerable<NotificationModel>>
{
    public async Task<IEnumerable<NotificationModel>> Handle(GetNotificationRequest request, CancellationToken cancellationToken)
    {
        var criteria = new GetNotificationCriteria
        {
            UserId = sessionService.UserId
        };

        return await repository.FetchAsync<NotificationModel>(criteria);
    }
}