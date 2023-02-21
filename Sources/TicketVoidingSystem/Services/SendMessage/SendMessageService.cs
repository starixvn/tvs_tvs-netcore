using System.Threading.Tasks;

namespace TicketVoidingSystem.Services.SendMessage;

public interface SendMessageService
{
    Task ToDo();
}

public class SendMessageServiceImp : SendMessageService
{
    public Task ToDo()
    {
        throw new System.NotImplementedException();
    }
}