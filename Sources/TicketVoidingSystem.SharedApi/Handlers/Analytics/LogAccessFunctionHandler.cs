using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.SharedApi.Services.Analytics;

namespace TicketVoidingSystem.SharedApi.Handlers.Analytics;

public class LogAccessFunctionRequest : IRequest<bool>
{
    public string FunctionName { get; set; }
}

public class LogAccessFunctionHandler : IRequestHandler<LogAccessFunctionRequest, bool>
{
    private readonly UserActionLogService userActionLogService;

    public LogAccessFunctionHandler(UserActionLogService userActionLogService)
    {
        this.userActionLogService = userActionLogService;
    }

    public async Task<bool> Handle(LogAccessFunctionRequest request, CancellationToken cancellationToken)
    {
        return await userActionLogService.LogAccessFunction(request.FunctionName);
    }
}