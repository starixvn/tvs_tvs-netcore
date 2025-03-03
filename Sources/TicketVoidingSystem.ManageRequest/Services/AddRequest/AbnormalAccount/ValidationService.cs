using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public interface ValidationService
{
    CheckUsernamesInDatabaseResult CheckValidUsernamesHandler(CheckValidUsernamesRequest request);
}

public class ValidationServiceImp : ValidationService
{
    public CheckUsernamesInDatabaseResult CheckValidUsernamesHandler(CheckValidUsernamesRequest request)
    {
        return new CheckUsernamesInDatabaseResult();
    }
}