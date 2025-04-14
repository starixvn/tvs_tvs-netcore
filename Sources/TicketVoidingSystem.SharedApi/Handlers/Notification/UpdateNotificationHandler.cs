using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Criteria.Notification;

namespace TicketVoidingSystem.SharedApi.Handlers.Notification;

public class UpdateNotificationRequest : IRequest
{
    public bool IsRead { get; set; }
    public int Id { get; set; }
};

public class UpdateNotificationHandler(IDynamicRepository repository, SessionService sessionService)
    : IRequestHandler<UpdateNotificationRequest>
{
    public async Task Handle(UpdateNotificationRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateNotificationCommand
        {
            UserId = sessionService.UserId,
            IsRead = request.IsRead,
            Id = request.Id
        };

        await repository.ExecuteAsync(command);
    }
}