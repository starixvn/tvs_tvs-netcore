using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Services.Analytics;

namespace TicketVoidingSystem.SharedApi.Handlers.Analytics;

public class LogChangeContentRequest : IRequest<bool>
{
    public string FunctionName { get; set; }

    public string? LogContent { get; set; }
}

public class LogChangeContentHandler(UserActionLogService userActionLogService)
    : IRequestHandler<LogChangeContentRequest, bool>
{
    public async Task<bool> Handle(LogChangeContentRequest request, CancellationToken cancellationToken)
    {
        return await userActionLogService.LogChangeContent(request.FunctionName, request.LogContent);
    }
}