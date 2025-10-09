using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.OnlineServerRepository;

namespace TicketVoidingSystem.ManageVoidServices.Handlers;

public class UpdateSummaryTicket19999Request : IRequest<Result>;

public class UpdateSummaryTicket19999Handler(OnlineServerRepository onlineServerRepository, LoggingService loggingService)
    : IRequestHandler<UpdateSummaryTicket19999Request, Result>
{
    public async Task<Result> Handle(UpdateSummaryTicket19999Request request, CancellationToken cancellationToken)
    {
        try
        {
            await onlineServerRepository.ExecuteAsync(new UpdateSummaryTicket19999Command());
            return new Result();
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(e.Message, e);
            return new Result
            {
                ErrorCode = ExecuteStatus.Failed,
                ErrorMsg = e.Message
            };
        }
    }
}