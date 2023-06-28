using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetExcelVoidedTicketForSendLetstalkRequest : GetVoidedTicketsQuery, IRequest<byte[]>
{
}

public class GetExcelVoidedTicketForSendLetstalkHandler : IRequestHandler<GetExcelVoidedTicketForSendLetstalkRequest, byte[]>
{
    private readonly ExcelService<GetVoidedTicketsQuery> excelService;

    public GetExcelVoidedTicketForSendLetstalkHandler(ExcelService<GetVoidedTicketsQuery> excelService)
    {
        this.excelService = excelService;
    }

    public async Task<byte[]> Handle(GetExcelVoidedTicketForSendLetstalkRequest request, CancellationToken cancellationToken)
    {
        request.IsCreditOnly = true;

        return await excelService.CreateFileAsByteArray(request, TemplateExcelPath.TicketVoiding_VoidedTickets);
    }
}