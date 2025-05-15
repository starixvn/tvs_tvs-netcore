using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Models.Notification;
using TicketVoidingSystem.Services.Notification;

namespace TicketVoidingSystem.SharedApi.Handlers.Notification;

public class GetNotificationRequest : IRequest<IEnumerable<NotificationModel>>;

public class GetNotificationHandler(NotificationService notificationService)
    : IRequestHandler<GetNotificationRequest, IEnumerable<NotificationModel>>
{
    public async Task<IEnumerable<NotificationModel>> Handle(GetNotificationRequest request, CancellationToken cancellationToken)
    {
        return await notificationService.Get();
    }
}