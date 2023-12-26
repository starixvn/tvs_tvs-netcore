using Microsoft.Extensions.DependencyInjection;
using NUglify.JavaScript;
using WebOptimizer;

namespace TicketVoidingSystem.Website.Utilities.WebOptimizer;

public static class RecoverParlayBetBundle
{
    public static void AddRecoverParlayBetBundle(this IAssetPipeline pipeline, CodeSettings scriptSetting)
    {
        //// style bundle
        pipeline.AddLessBundle("/old-page/bundle/recover-cash-out-style.css", "old-page/recover-cash-out/recover-cash-out.less");

        //// script bundle
        pipeline.AddJavaScriptBundle("/old-page/bundle/recover-cash-out.js", scriptSetting,
            "old-page/scripts/_libs/ContextMenu/jquery.contextMenu.js",
            "old-page/scripts/Common/Message.Helper.js",
            "old-page/scripts/Common/Message.Validator.js",
            "old-page/scripts/Common/ContextMenu.Helper.js",
            "old-page/recover-cash-out/scripts/recover-cash-out.directive.js",
            "old-page/recover-cash-out/scripts/recover-cash-out.js",
            "old-page/recover-cash-out/scripts/recover-cash-out.service.js",
            "old-page/recover-cash-out/scripts/recover-cash-out.validation.js");
    }
}