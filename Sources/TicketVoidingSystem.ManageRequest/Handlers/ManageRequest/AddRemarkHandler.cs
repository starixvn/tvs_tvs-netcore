using MediatR;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class AddRemarkQuery : IRequest<Result>
{
    public int? RemarkId { get; set; }
    public string Guid { get; set; } = string.Empty;
    public int SessionTime { get; set; }
    public int MatchId { get; set; }
    public bool IsOpen { get; set; } = true;
    public bool IsCheckedVar { get; set; }
    public bool IsHighLightVarCheck { get; set; }
    public string? MistakenBy { get; set; }
    public string? DecidedBy { get; set; }
    public string? PerformedBy { get; set; }
    public string? Iptv { get; set; }
    public string? Suspender { get; set; }
    public string? Provider { get; set; }
    public string? Trader { get; set; }
    public string? Source { get; set; }
    public string? Remark { get; set; }
    public string? Message { get; set; }
    public string? Description { get; set; }
    public string? Action { get; set; }
}

public class AddRemarkHandler : IRequestHandler<AddRemarkQuery, Result>
{
    public async Task<Result> Handle(AddRemarkQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement AddRemark logic
        return new Result { ErrorCode = 0, ErrorMsg = "Success" };
    }
}


