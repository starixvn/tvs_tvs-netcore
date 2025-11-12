using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.TechnicalError;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.TechnicalError;

public class CheckProviderMistakeTicketsServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly CheckProviderMistakeTicketsServiceImp service;

    public CheckProviderMistakeTicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new CheckProviderMistakeTicketsServiceImp(repository);
    }

    [Fact]
    public async Task ValidateTickets_ValidDataFromMultipleServers_ReturnAggregatedResult()
    {
        // Arrange
        var transIds = "123,456,789";
        var validation1 = new ValidationProviderMistake
        {
            ValidTransIds = "123,456",
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 1
        };
        var validation2 = new ValidationProviderMistake
        {
            ValidTransIds = "789",
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 2
        };
        var transInfo1 = new TransInfoAddRequestModel
        {
            MarkTransIds = "123,456",
            TransInfoJson = "{\"transIds\":[123,456]}"
        };
        var transInfo2 = new TransInfoAddRequestModel
        {
            MarkTransIds = "789",
            TransInfoJson = "{\"transIds\":[789]}"
        };

        var callCount = 0;
        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns(x =>
            {
                callCount++;
                if (callCount == 1)
                    return (new[] { validation1 }, new[] { transInfo1 });
                if (callCount == 2)
                    return (new[] { validation2 }, new[] { transInfo2 });
                // Các lần gọi sau trả về empty
                return (Enumerable.Empty<ValidationProviderMistake>(), Enumerable.Empty<TransInfoAddRequestModel>());
            });

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Validation);
        Assert.Contains("123", result.Validation.ValidTransIds);
        Assert.Contains("456", result.Validation.ValidTransIds);
        Assert.Contains("789", result.Validation.ValidTransIds);
        Assert.Equal(1, result.Validation.MatchId); // MatchId từ server đầu tiên có MatchId > 0
    }

    [Fact]
    public async Task ValidateTickets_EmptyTransIds_ReturnEmptyResult()
    {
        // Arrange
        var transIds = string.Empty;

        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns((Enumerable.Empty<ValidationProviderMistake>(), Enumerable.Empty<TransInfoAddRequestModel>()));

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Validation);
        Assert.NotNull(result.TransInfoAddRequest);
        Assert.True(string.IsNullOrEmpty(result.Validation.ValidTransIds));
        Assert.True(string.IsNullOrEmpty(result.Validation.InvalidTransIds));

        // Verify repository được gọi đúng số lần
        await repository.Received(SiteDbGroupConstant.ServerList.Count)
            .FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
                Arg.Any<CheckProviderMistakeTicketsCriteria>());
    }

    [Fact]
    public async Task ValidateTickets_NoResultsFromServers_ReturnEmptyResult()
    {
        // Arrange
        var transIds = "123,456";

        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns((Enumerable.Empty<ValidationProviderMistake>(), Enumerable.Empty<TransInfoAddRequestModel>()));

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Validation);
        Assert.NotNull(result.TransInfoAddRequest);
        Assert.True(string.IsNullOrEmpty(result.Validation.ValidTransIds));
        Assert.True(string.IsNullOrEmpty(result.Validation.InvalidTransIds));
        Assert.True(string.IsNullOrEmpty(result.TransInfoAddRequest.MarkTransIds));
        Assert.True(string.IsNullOrEmpty(result.TransInfoAddRequest.TransInfoJson));

        // Verify repository được gọi đúng số lần
        await repository.Received(SiteDbGroupConstant.ServerList.Count)
            .FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
                Arg.Any<CheckProviderMistakeTicketsCriteria>());
    }

    [Fact]
    public async Task ValidateTickets_AggregateValidTransIds_ReturnDistinctValues()
    {
        // Arrange
        var transIds = "123,456";
        var validation1 = new ValidationProviderMistake
        {
            ValidTransIds = "123,456",
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 1
        };
        var validation2 = new ValidationProviderMistake
        {
            ValidTransIds = "123,789", // 123 bị trùng
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 2
        };

        var callCount = 0;
        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns(x =>
            {
                callCount++;
                if (callCount == 1)
                    return (new[] { validation1 }, new[] { new TransInfoAddRequestModel() });
                if (callCount == 2)
                    return (new[] { validation2 }, new[] { new TransInfoAddRequestModel() });
                // Các lần gọi sau trả về empty
                return (Enumerable.Empty<ValidationProviderMistake>(), Enumerable.Empty<TransInfoAddRequestModel>());
            });

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        var validTransIds = result.Validation.ValidTransIds.Split(',').ToList();
        Assert.Equal(3, validTransIds.Count); // 123, 456, 789 (123 chỉ xuất hiện 1 lần)
        Assert.Contains("123", validTransIds);
        Assert.Contains("456", validTransIds);
        Assert.Contains("789", validTransIds);
    }

    [Fact]
    public async Task ValidateTickets_AggregateInvalidTransIds_ReturnDistinctValues()
    {
        // Arrange
        var transIds = "123,456,789";
        var validation1 = new ValidationProviderMistake
        {
            ValidTransIds = "123",
            InvalidTransIds = "456",
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 1
        };
        var validation2 = new ValidationProviderMistake
        {
            ValidTransIds = string.Empty,
            InvalidTransIds = "789",
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 0
        };

        var callCount = 0;
        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns(x =>
            {
                callCount++;
                if (callCount == 1)
                    return (new[] { validation1 }, new[] { new TransInfoAddRequestModel() });
                if (callCount == 2)
                    return (new[] { validation2 }, new[] { new TransInfoAddRequestModel() });
                // Các lần gọi sau trả về empty
                return (Enumerable.Empty<ValidationProviderMistake>(), Enumerable.Empty<TransInfoAddRequestModel>());
            });

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        var invalidTransIds = result.Validation.InvalidTransIds.Split(',').ToList();
        Assert.Equal(2, invalidTransIds.Count);
        Assert.Contains("456", invalidTransIds);
        Assert.Contains("789", invalidTransIds);
        Assert.DoesNotContain("123", invalidTransIds); // 123 là valid nên không có trong invalid
    }

    [Fact]
    public async Task ValidateTickets_AggregateExistingReqTransIds_ExcludeValidTransIds()
    {
        // Arrange
        var transIds = "123,456,789";
        var validation1 = new ValidationProviderMistake
        {
            ValidTransIds = "123",
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = "456",
            UnsupportedTransIds = string.Empty,
            MatchId = 1
        };
        var validation2 = new ValidationProviderMistake
        {
            ValidTransIds = "456", // 456 là valid ở server 2
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = "789",
            UnsupportedTransIds = string.Empty,
            MatchId = 2
        };

        var callCount = 0;
        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns(x =>
            {
                callCount++;
                if (callCount == 1)
                    return (new[] { validation1 }, new[] { new TransInfoAddRequestModel() });
                if (callCount == 2)
                    return (new[] { validation2 }, new[] { new TransInfoAddRequestModel() });
                // Các lần gọi sau trả về empty
                return (Enumerable.Empty<ValidationProviderMistake>(), Enumerable.Empty<TransInfoAddRequestModel>());
            });

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        // 456 không có trong ExistingReqTransIds vì nó là valid ở server 2
        // 789 có trong ExistingReqTransIds vì không phải valid
        var existingReqTransIds = result.Validation.ExistingReqTransIds.Split(',').ToList();
        Assert.Contains("789", existingReqTransIds);
        Assert.DoesNotContain("456", existingReqTransIds);
        Assert.DoesNotContain("123", existingReqTransIds);
    }

    [Fact]
    public async Task ValidateTickets_AggregateUnsupportedTransIds_ExcludeValidTransIds()
    {
        // Arrange
        var transIds = "123,456,789";
        var validation1 = new ValidationProviderMistake
        {
            ValidTransIds = "123",
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = "456",
            MatchId = 1
        };
        var validation2 = new ValidationProviderMistake
        {
            ValidTransIds = "456", // 456 là valid ở server 2
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = "789",
            MatchId = 2
        };

        var callCount = 0;
        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns(x =>
            {
                callCount++;
                if (callCount == 1)
                    return (new[] { validation1 }, new[] { new TransInfoAddRequestModel() });
                if (callCount == 2)
                    return (new[] { validation2 }, new[] { new TransInfoAddRequestModel() });
                // Các lần gọi sau trả về empty
                return (Enumerable.Empty<ValidationProviderMistake>(), Enumerable.Empty<TransInfoAddRequestModel>());
            });

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        // 456 không có trong UnsupportedTransIds vì nó là valid ở server 2
        // 789 có trong UnsupportedTransIds vì không phải valid
        var unsupportedTransIds = result.Validation.UnsupportedTransIds.Split(',').ToList();
        Assert.Contains("789", unsupportedTransIds);
        Assert.DoesNotContain("456", unsupportedTransIds);
        Assert.DoesNotContain("123", unsupportedTransIds);
    }

    [Fact]
    public async Task ValidateTickets_AggregateTransInfoJson_ReturnJoinedValues()
    {
        // Arrange
        var transIds = "123,456";
        var validation = new ValidationProviderMistake
        {
            ValidTransIds = "123,456",
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 1
        };
        var transInfo1 = new TransInfoAddRequestModel
        {
            MarkTransIds = "123",
            TransInfoJson = "{\"transIds\":[123]}"
        };
        var transInfo2 = new TransInfoAddRequestModel
        {
            MarkTransIds = "456",
            TransInfoJson = "{\"transIds\":[456]}"
        };

        var callCount = 0;
        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns(x =>
            {
                callCount++;
                if (callCount == 1)
                    return (new[] { validation }, new[] { transInfo1 });
                if (callCount == 2)
                    return (new[] { validation }, new[] { transInfo2 });
                // Các lần gọi sau trả về empty
                return (Enumerable.Empty<ValidationProviderMistake>(), Enumerable.Empty<TransInfoAddRequestModel>());
            });

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.TransInfoAddRequest);
        Assert.Contains("{\"transIds\":[123]}", result.TransInfoAddRequest.TransInfoJson);
        Assert.Contains("{\"transIds\":[456]}", result.TransInfoAddRequest.TransInfoJson);
        Assert.Contains("123", result.TransInfoAddRequest.MarkTransIds);
        Assert.Contains("456", result.TransInfoAddRequest.MarkTransIds);
    }

    [Fact]
    public async Task ValidateTickets_MatchIdFromFirstServer_ReturnMatchId()
    {
        // Arrange
        var transIds = "123,456";
        var validation1 = new ValidationProviderMistake
        {
            ValidTransIds = "123",
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 0 // MatchId = 0 không được chọn
        };
        var validation2 = new ValidationProviderMistake
        {
            ValidTransIds = "456",
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 5 // MatchId > 0 được chọn
        };

        var callCount = 0;
        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns(x =>
            {
                callCount++;
                if (callCount == 1)
                    return (new[] { validation1 }, new[] { new TransInfoAddRequestModel() });
                if (callCount == 2)
                    return (new[] { validation2 }, new[] { new TransInfoAddRequestModel() });
                // Các lần gọi sau trả về empty
                return (Enumerable.Empty<ValidationProviderMistake>(), Enumerable.Empty<TransInfoAddRequestModel>());
            });

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(5, result.Validation.MatchId); // MatchId từ server đầu tiên có MatchId > 0
    }

    [Fact]
    public async Task ValidateTickets_NullValidationResults_HandleGracefully()
    {
        // Arrange
        var transIds = "123,456";

        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns((new ValidationProviderMistake[] { null }, new TransInfoAddRequestModel[] { null }));

        // Act
        var result = await service.ValidateTickets(transIds);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Validation);
        Assert.NotNull(result.TransInfoAddRequest);
        Assert.True(string.IsNullOrEmpty(result.Validation.ValidTransIds));

        // Verify repository được gọi đúng số lần
        await repository.Received(SiteDbGroupConstant.ServerList.Count)
            .FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
                Arg.Any<CheckProviderMistakeTicketsCriteria>());
    }

    [Fact]
    public async Task ValidateTickets_EmptyStringTransIds_HandleGracefully()
    {
        // Arrange
        var validation = new ValidationProviderMistake
        {
            ValidTransIds = string.Empty,
            InvalidTransIds = string.Empty,
            ExistingReqTransIds = string.Empty,
            UnsupportedTransIds = string.Empty,
            MatchId = 0
        };

        repository.FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
            Arg.Any<CheckProviderMistakeTicketsCriteria>())
            .Returns((new[] { validation }, new[] { new TransInfoAddRequestModel() }));

        // Act
        var result = await service.ValidateTickets("123,456");

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Validation);
        Assert.True(string.IsNullOrEmpty(result.Validation.ValidTransIds));
        Assert.True(string.IsNullOrEmpty(result.Validation.InvalidTransIds));

        // Verify repository được gọi đúng số lần
        await repository.Received(SiteDbGroupConstant.ServerList.Count)
            .FetchMultipleAsync<ValidationProviderMistake, TransInfoAddRequestModel>(
                Arg.Any<CheckProviderMistakeTicketsCriteria>());
    }
}