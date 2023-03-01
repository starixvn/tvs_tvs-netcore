using System.Collections.Generic;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail;

public interface MailResultService
{
    Result CreateSuccess(string siteName, string[] listEmail, bool isFromAfterVoidService);

    Result CreateFail(string siteName, bool isFromAfterVoidService);

    List<Result> InsertCombineLicenseesName(List<Result> results, string siteNameSuccess, string siteNameFails);

    List<Result> InsertCombineLicenseesNameForAfterVoidService(List<Result> results, string siteNameSuccess, string siteNameFails);
}

public class MailResultServiceImp : MailResultService
{
    public Result CreateSuccess(string siteName, string[] listEmail, bool isFromAfterVoidService)
    {
        return new Result
        {
            ErrorCode = isFromAfterVoidService ? ErrorCode.SendEmailToLicenseeSuccess : 0,
            ErrorMsg = string.Format(StringResource.VoidBetDetailsSendMailSuccess, siteName, string.Join("; ", listEmail)),
        };
    }

    public Result CreateFail(string siteName, bool isFromAfterVoidService)
    {
        return new Result
        {
            ErrorCode = isFromAfterVoidService ? ErrorCode.SendEmailToLicenseeFail : ErrorCode.SendMessageOrEmailFail,
            ErrorMsg = string.Format(StringResource.VoidBetDetailsSendMailFail, siteName),
        };
    }

    public List<Result> InsertCombineLicenseesName(List<Result> results, string siteNameSuccess, string siteNameFails)
    {
        InsertSuccessful(results);
        InsertSuccessfulCombine(results, siteNameSuccess);
        InsertFailedCombine(results, siteNameFails);
        InsertDetailText(results, siteNameSuccess, siteNameFails);
        return results;
    }

    private static void InsertSuccessful(List<Result> result)
    {
        var success = new Result
        {
            ErrorCode = 0,
            ErrorMsg = StringResource.VoidBetSuccessfully
        };
        result.Insert(0, success);
    }

    private static void InsertSuccessfulCombine(List<Result> results, string licensees)
    {
        var successLicensees = new Result
        {
            ErrorCode = 0,
            ErrorMsg = string.IsNullOrEmpty(licensees) ? string.Empty : string.Format(StringResource.VoidBetSendMailSuccess, licensees)
        };
        results.Insert(1, successLicensees);
    }

    private static void InsertFailedCombine(List<Result> results, string licensees)
    {
        var failedLicensees = new Result
        {
            ErrorCode = ErrorCode.SendMessageOrEmailFail,
            ErrorMsg = string.IsNullOrEmpty(licensees) ? string.Empty : string.Format(StringResource.VoidBetSendMailFail, licensees)
        };
        results.Insert(CategoryEmail.FailedCombine, failedLicensees);
    }

    private static void InsertDetailText(List<Result> results, string first, string second)
    {
        if (!string.IsNullOrEmpty(first) || !string.IsNullOrEmpty(second))
        {
            var detailText = new Result
            {
                ErrorCode = ErrorCode.DivideMessageMailDetail,
                ErrorMsg = StringResource.ForMoreDetails
            };
            results.Insert(CategoryEmail.DetailText, detailText);
        }
    }

    public List<Result> InsertCombineLicenseesNameForAfterVoidService(List<Result> results, string siteNameSuccess, string siteNameFails)
    {
        if (!string.IsNullOrEmpty(siteNameSuccess))
        {
            var successLicensees = new Result
            {
                ErrorCode = ErrorCode.LicenseeSuccess,
                ErrorMsg = string.Format(StringResource.VoidBetSendMailSuccess, siteNameSuccess),
                Data = siteNameSuccess
            };
            results.Add(successLicensees);
        }

        if (!string.IsNullOrEmpty(siteNameFails))
        {
            var failedLicenses = new Result
            {
                ErrorCode = ErrorCode.LicenseeFail,
                ErrorMsg = string.Format(StringResource.VoidBetSendMailFail, siteNameFails),
                Data = siteNameFails
            };
            results.Add(failedLicenses);
        }

        return results;
    }
}