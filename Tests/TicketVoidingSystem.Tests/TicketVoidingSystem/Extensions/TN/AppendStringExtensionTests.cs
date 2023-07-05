using System;
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
            
            // Act
            var result = ((string)null).AppendWithNewLine("Extend");

            // Assert
            Assert.Equal("Extend", result);
        }

        [Fact]
        public void AppendWithNewLine_WithNullOrWhiteSpaceExtend_ReturnsRoot()
        {
            // Arrange
            const string root = "Root";

            // Act
            var result = root.AppendWithNewLine(null);

            // Assert
            Assert.Equal(root, result);
        }

        [Fact]
        public void AppendWithNewLine_WithValidRootAndExtend_ReturnsAppendedString()
        {
            // Arrange
            const string root = "Root";
            var expected = $"Root{Environment.NewLine}Extend";

            // Act
            var result = root.AppendWithNewLine("Extend");

            // Assert
            Assert.Equal(expected, result);
        }

        [Fact]
        public void Intersected_WithNullOrEmptyTextWithComma_ReturnsEmptyString()
        {
            // Arrange
            var listString = new List<string> { "User1", "User2" };

            // Act
            var result = ((string)null).Intersected(listString);

            // Assert
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void Intersected_WithValidTextWithCommaAndDistinctListString_ReturnsIntersectedString()
        {
            // Arrange
            const string textWithComma = "User1,User2,User3";
            var listString = new List<string> { "User2", "User3", "User4" };
            const string expected = "User2, User3";

            // Act
            var result = textWithComma.Intersected(listString);

            // Assert
            Assert.Equal(expected, result);
        }

        [Fact]
        public void Eliminate_WithNullOrWhiteSpaceRoot_ReturnsEmptyString()
        {
            // Arrange

            // Act
            var result = ((string)null).Eliminate("User1,User2");

            // Assert
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void Eliminate_WithNullOrWhiteSpaceElimination_ReturnsRoot()
        {
            // Arrange
            const string root = "User1,User2,User3";

            // Act
            var result = root.Eliminate(null);

            // Assert
            Assert.Equal(root, result);
        }

        [Fact]
        public void Eliminate_WithValidRootAndElimination_ReturnsEliminatedString()
        {
            // Arrange
            const string root = "User1,User2,User3,User4";

            // Act
            var result = root.Eliminate("User2,User4");

            // Assert
            Assert.Equal("User1,User3", result);
        }
    }
}