using System;
using System.Threading.Tasks;
using Fanex.Logging;

namespace TicketVoidingSystem.Services
{
    public interface LoggingService
    {
        Task ErrorAsync(string message, Exception exception);

        Task ErrorAsync(string message);

        Task InfoAsync(string message);
    }

    public class LoggingServiceImp : LoggingService
    {
        public async Task ErrorAsync(string message, Exception exception)
        {
            await LogService.ErrorAsync(message, exception);
        }

        public async Task ErrorAsync(string message)
        {
            await LogService.ErrorAsync(message);
        }

        public async Task InfoAsync(string message)
        {
            await LogService.InfoAsync(message);
        }
    }
}