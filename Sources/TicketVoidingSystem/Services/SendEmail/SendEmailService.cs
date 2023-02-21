using System.Collections.Generic;
using System.Threading.Tasks;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services.SendEmail;

public interface SendEmailService
{
    Task<IEnumerable<Result>> ToDo();
}

public class SendEmailServiceImp : SendEmailService
{
    public Task<IEnumerable<Result>> ToDo()
    {
        throw new System.NotImplementedException();
    }
}