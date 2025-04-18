using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Services.Notification;

namespace TicketVoidingSystem.SharedApi.Handlers.Notification;

public class UpdateNotificationRequest : IRequest<Unit>
{
    public bool IsRead { get; set; }
    public int Id { get; set; }
};

public class UpdateNotificationHandler(NotificationService notificationService)
    : IRequestHandler<UpdateNotificationRequest, Unit>
{
    public async Task<Unit> Handle(UpdateNotificationRequest request, CancellationToken cancellationToken)
    {
        await notificationService.UpdateNotification(request.Id, request.IsRead);
        return Unit.Value;
    }
}