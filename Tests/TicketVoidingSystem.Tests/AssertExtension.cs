using Newtonsoft.Json;
using Xunit;

namespace TicketVoidingSystem.Tests
{
    public static class AssertExtension
    {
        public static void Equal(object expected, object actual)
        {
            var expectedJson = JsonConvert.SerializeObject(expected);
            var actualJson = JsonConvert.SerializeObject(actual);

            Assert.Equal(expectedJson, actualJson);
        }
    }
}