using System;
using System.Collections.Generic;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Extensions
{
    public class ObjectToXmlExtensionTests
    {
        [Fact]
        public void ToTransDateXml_TransDateListIsNull_ReturnEmptyString()
        {
            // Arrange
            IEnumerable<TransDateXmlModel> transDateList = null;

            // Act
            var result = transDateList.ToTransDateXml();

            // Assert
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void ToTransDateXml_TransDateListIsNotEmpty_ReturnXmlString()
        {
            // Arrange
            var transDateList = new List<TransDateXmlModel>
            {
                new TransDateXmlModel
                {
                    FromTransDate = DateTime.Parse("2023-06-01"),
                    ToTransDate = DateTime.Parse("2023-06-07")
                },
                new TransDateXmlModel
                {
                    FromTransDate = DateTime.Parse("2023-06-10"),
                    ToTransDate = DateTime.Parse("2023-06-15")
                }
            };
            var expected = "<TransDates>\r\n<TransDate From=\"2023/05/31 12:00:00.000\" To=\"2023/06/06 12:00:00.000\" />\r\n<TransDate From=\"2023/06/09 12:00:00.000\" To=\"2023/06/14 12:00:00.000\" />\r\n</TransDates>";
            
            // Act
            var result = transDateList.ToTransDateXml();

            // Assert
            Assert.Equal(expected, result);
        }

        [Fact]
        public void ToBetTypeXml_BetTypesIsNull_ReturnNull()
        {
            // Arrange
            IEnumerable<BetTypeXml> betTypes = null;

            // Act
            var result = betTypes.ToBetTypeXml();

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void ToBetTypeXml_BetTypesIsNotEmpty_ReturnXmlString()
        {
            // Arrange
            var betTypes = new List<BetTypeXml>
    {
        new BetTypeXml
        {
            Id = 1,
            BetTeam = "Team A",
            Set = "1",
            Game = "2",
            Value = "10",
            ValueHdp1 = "0.5",
            ValueHdp2 = "-0.5",
            Goal = "2.5",
            BetOption = "Option A",
            OddsSpread = "1.5",
            OddsId = "123",
            Transdesc = "Description A"
        },
        new BetTypeXml
        {
            Id = 2,
            BetTeam = "Team B",
            Set = "2",
            Game = "3",
            Value = "20",
            ValueHdp1 = "0.25",
            ValueHdp2 = "-0.25",
            Goal = "3.5",
            BetOption = "Option B",
            OddsSpread = "2.5",
            OddsId = "456",
            Transdesc = "Description B"
        }
    };
            var expected = "<BetTypes>\r\n<BetType Id=\"1\" BetTeam=\"Team A\" Set=\"1\" Game=\"2\" Value=\"10\" ValueHdp1=\"0.5\" ValueHdp2=\"-0.5\" Goal=\"2.5\" BetOption=\"Option A\" OddsSpread=\"1.5\" OddsId=\"123\" Transdesc=\"Description A\" />\r\n<BetType Id=\"2\" BetTeam=\"Team B\" Set=\"2\" Game=\"3\" Value=\"20\" ValueHdp1=\"0.25\" ValueHdp2=\"-0.25\" Goal=\"3.5\" BetOption=\"Option B\" OddsSpread=\"2.5\" OddsId=\"456\" Transdesc=\"Description B\" />\r\n</BetTypes>";

            // Act
            var result = betTypes.ToBetTypeXml();

            // Assert
            Assert.Equal(expected, result);
        }
    }
}
