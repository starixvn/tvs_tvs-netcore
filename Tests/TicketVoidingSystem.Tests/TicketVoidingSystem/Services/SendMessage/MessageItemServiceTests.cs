using System.Collections.Generic;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendMessage
{
    public class MessageItemServiceTests
    {
        private readonly MessageItemServiceImp service;

        public MessageItemServiceTests()
        {
            service = new MessageItemServiceImp();
        }

        [Fact]
        public void InsertMessage_ValidData_CacheServiceCalledContainAsync()
        {
            // Arrange
            var expected = "<Messages><Item MessageId=\"1\" TargetId=\"101\" TargetName=\"Name\" BetTransId=\"1\" /><Item MessageId=\"1\" TargetId=\"101\" " +
                           "TargetName=\"Name\" BetTransId=\"1\" /><Item MessageId=\"1\" TargetId=\"101\" TargetName=\"Name\" BetTransId=\"1\" /><Item MessageId=\"1\" " +
                           "TargetId=\"101\" TargetName=\"Name\" BetTransId=\"1\" /></Messages>";
            var receivedUsers = new List<ReceivedUser>
            {
                new ReceivedUser { CustId = 101, CustUserName = "Name", TransId  = 1},
                new ReceivedUser { Recommend = 101, AgUserName = "Name", TransId  = 1},
                new ReceivedUser { Mrecommend = 101, MagUserName = "Name", TransId  = 1},
                new ReceivedUser { Srecommend = 101, SagUserName = "Name", TransId  = 1}
            };
            int messageId = 1;

            // Act
            var actual = service.CreateMessageItems(receivedUsers, messageId);

            // Assert
            Assert.Equal(expected,actual);
        }
    }
}
