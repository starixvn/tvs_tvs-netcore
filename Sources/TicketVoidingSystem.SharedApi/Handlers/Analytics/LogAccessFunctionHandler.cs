using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Services.Analytics;

namespace TicketVoidingSystem.SharedApi.Handlers.Analytics;

public class LogAccessFunctionRequest : IRequest<bool>
{
    public string FunctionName { get; set; }
}

public class LogAccessFunctionHandler(UserActionLogService userActionLogService)
    : IRequestHandler<LogAccessFunctionRequest, bool>
{
    public Task<bool> Handle(LogAccessFunctionRequest request, CancellationToken cancellationToken)
    {
        var result = userActionLogService.LogAccessFunction(request.FunctionName);
        return Task.FromResult(result);
    }
}