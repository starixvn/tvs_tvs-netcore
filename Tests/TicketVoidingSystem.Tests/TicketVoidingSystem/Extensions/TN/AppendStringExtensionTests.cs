using System.Collections.Generic;
using TicketVoidingSystem.Extensions.TN;
using Xunit;

namespace TicketVoidingSystem.Tests.Extensions.TN
{
    public class AppendStringExtensionTests
    {
        [Fact]
        public void AppendWithNewLine_WithNullRoot_ReturnsExtend()
        {
            // Arrange
            string root = null;
            string extend = "Extend";

            // Act
            var result = root.AppendWithNewLine(extend);

            // Assert
            Assert.Equal(extend, result);
        }

        [Fact]
        public void AppendWithNewLine_WithNullOrWhiteSpaceExtend_ReturnsRoot()
        {
            // Arrange
            string root = "Root";
            string extend = null;

            // Act
            var result = root.AppendWithNewLine(extend);

            // Assert
            Assert.Equal(root, result);
        }

        [Fact]
        public void AppendWithNewLine_WithValidRootAndExtend_ReturnsAppendedString()
        {
            // Arrange
            string root = "Root";
            string extend = "Extend";
            string expected = "Root\r\nExtend";

            // Act
            var result = root.AppendWithNewLine(extend);

            // Assert
            Assert.Equal(expected, result);
        }

        [Fact]
        public void Intersected_WithNullOrEmptyTextWithComma_ReturnsEmptyString()
        {
            // Arrange
            string textWithComma = null;
            var listString = new List<string> { "User1", "User2" };

            // Act
            var result = textWithComma.Intersected(listString);

            // Assert
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void Intersected_WithValidTextWithCommaAndDistinctListString_ReturnsIntersectedString()
        {
            // Arrange
            string textWithComma = "User1,User2,User3";
            var listString = new List<string> { "User2", "User3", "User4" };
            string expected = "User2, User3";

            // Act
            var result = textWithComma.Intersected(listString);

            // Assert
            Assert.Equal(expected, result);
        }

        [Fact]
        public void Eliminate_WithNullOrWhiteSpaceRoot_ReturnsEmptyString()
        {
            // Arrange
            string root = null;
            string elimination = "User1,User2";

            // Act
            var result = root.Eliminate(elimination);

            // Assert
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void Eliminate_WithNullOrWhiteSpaceElimination_ReturnsRoot()
        {
            // Arrange
            string root = "User1,User2,User3";
            string elimination = null;

            // Act
            var result = root.Eliminate(elimination);

            // Assert
            Assert.Equal(root, result);
        }

        [Fact]
        public void Eliminate_WithValidRootAndElimination_ReturnsEliminatedString()
        {
            // Arrange
            string root = "User1,User2,User3,User4";
            string elimination = "User2,User4";
            string expected = "User1,User3";

            // Act
            var result = root.Eliminate(elimination);

            // Assert
            Assert.Equal(expected, result);
        }

    }
}