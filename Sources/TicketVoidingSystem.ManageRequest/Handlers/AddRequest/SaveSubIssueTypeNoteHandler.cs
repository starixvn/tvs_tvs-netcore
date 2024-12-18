using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class SaveSubIssueTypeNoteRequest : SaveSubIssueTypeNoteCommand, IRequest<Result>;

public class SaveSubIssueTypeNoteHandler(IDynamicRepository repository, LoggingService loggingService)
    : IRequestHandler<SaveSubIssueTypeNoteRequest, Result>
{
    public async Task<Result> Handle(SaveSubIssueTypeNoteRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await repository.ExecuteAsync(request);
            return new Result();
        }
        catch (Exception e)
        {
            await loggingService.ErrorAsync(e.Message, e);
            return new Result
            {
                ErrorCode = 1,
                ErrorMsg = e.Message
            };
        }
    }
}