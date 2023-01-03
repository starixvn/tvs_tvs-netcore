using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.MarkTickets.Models.ConfirmAutoUnmark;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.MarkTickets.Services.ConfirmAutoUnmark
{
    public interface CombineValidationService
    {
        UpdateConfirmAutoUnmarkValidation CombineUpdateResult(IEnumerable<UpdateConfirmAutoUnmarkValidation> validationInAllServers);
    }

    public class CombineValidationServiceImp : CombineValidationService
    {
        public UpdateConfirmAutoUnmarkValidation CombineUpdateResult(IEnumerable<UpdateConfirmAutoUnmarkValidation> validationInAllServers)
        {
            var validationResult = GetValidationResult(validationInAllServers);
            return new UpdateConfirmAutoUnmarkValidation
            {
                ErrorCode = validationResult.ErrorCode,
                ErrorMsg = validationResult.ErrorMsg,
                NegativeBalanceUsers = Helper.GetUnionTransIdString(validationInAllServers.Select(x => x.NegativeBalanceUsers))
            };
        }

        private UpdateConfirmAutoUnmarkValidation GetValidationResult(IEnumerable<UpdateConfirmAutoUnmarkValidation> validationInAllServers)
        {
            const int codeConfirmOkButNoTickets = 111;
            var errorResult =
                validationInAllServers.FirstOrDefault(x => x.ErrorCode != 0 && x.ErrorCode != codeConfirmOkButNoTickets);

            if (errorResult != null)
            {
                return errorResult;
            }

            return validationInAllServers.All(x => x.ErrorCode == codeConfirmOkButNoTickets)
                ? validationInAllServers.First() : new UpdateConfirmAutoUnmarkValidation { ErrorCode = 0, ErrorMsg = string.Empty };
        }
    }
}