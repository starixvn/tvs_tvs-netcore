using System;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using Org.BouncyCastle.Asn1.Ocsp;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.Services.Excel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class EditRequestHandlerTests
    {
        [Fact]
        public async Task ExportExcel_ValidData_CalledExpected()
        {
            var editRequestService = Substitute.For<EditRequestService>();
            var handler = new EditRequestHandler(editRequestService);
            var request = new EditRequest();

            // Act
            _ = await handler.Handle(request, CancellationToken.None);

            // Assert
            await editRequestService.Received(1).UpdateRequest(request);
        }
    }
}
