using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Services.Analytics;

namespace TicketVoidingSystem.SharedApi.Handlers.Analytics;

public class LogChangeContentRequest : IRequest
{
    public string FunctionName { get; set; }

    public string? LogContent { get; set; }
}

public class LogChangeContentHandler(UserActionLogService userActionLogService)
    : IRequestHandler<LogChangeContentRequest>
{
    public Task Handle(LogChangeContentRequest request, CancellationToken cancellationToken)
    {
        userActionLogService.LogChangeContent(request.FunctionName, request.LogContent);
        return Task.CompletedTask;
    }
}